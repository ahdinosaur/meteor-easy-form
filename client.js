EasyForm = {}
EasyForm.helper = function (attrs) {
  var hash = attrs.hash,
      tmpl;

  if (_.isString(hash.col)) {
    hash.col = window[hash.col];
  }

  if (!(( _.isObject(hash.col)) && 
        ( _.isString(hash.type)))) {
    console.log(hash.col, hash.data, hash.type);
    throw new Error(
      "incorrect arguments to easyform. " +
      "usage: {{ easyform col=\"MyCollection\" data=this type=\"update\" options=myOptionsHelper }}"
    );
  }

  if (!_.has(EasyForm, hash.type)) {
    throw new Error("incorrect hash.type of easyform");
  }
  var tmpl = EasyForm[hash.type];

  return new Handlebars.SafeString(
    tmpl(_.extend(hash, {
      id: Random.id()
    }))
  );
};

Handlebars.registerHelper('easyform', EasyForm.helper);

EasyForm.formTemplateRendered = function (type, fun) {
  return function () {
    var self = this,
        data = self.data.data,
        col = self.data.col,
        schema = col.schema,
        options = self.data.options || {},
        sel = '#' + self.data.id,
        dbAction, alpacaType;

    fun = fun || function (c) { return c(); },

    options.renderForm = true;
    options.form = {
      buttons: {
        submit: {
          value: type
        }
      }
    };

    if (type === 'update') {
      dbAction = function (val) {
        col.update({ _id: data._id }, {
          $set: val
        });
      };
      alpacaType = "edit";
    } else if (type === 'insert') {
      dbAction = function (val) {
        col.insert(val);
      };
      alpacaType = "create";
    } else {
      new Error('incorrect type to formTemplateRendered');
    }

    $(sel).alpaca({
      data: data,
      schema: schema,
      options: options,
      postRender: function (renderedForm) {
        $(sel + ' button[type="submit"]').click(function (e) {
          e.preventDefault();
          return fun(function () {
            if (renderedForm.isValid(true)) {
              var val = renderedForm.getValue();
              return dbAction(val);
            }
          });
        });
      },
      ui: EasyForm.ui,
      type: alpacaType
    });
  };
};

Template.easyFormUpdate.rendered = EasyForm.formTemplateRendered('update');
Template.easyFormInsert.rendered = EasyForm.formTemplateRendered('insert');

EasyForm.update = Template.easyFormUpdate;
EasyForm.insert = Template.easyFormInsert;
