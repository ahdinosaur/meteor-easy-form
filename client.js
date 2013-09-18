Handlebars.registerHelper('easyform', function (attrs) {
  var hash = attrs.hash,
      col = hash.col,
      data = hash.data,
      type = hash.type,
      options = hash.options,
      tmpl;

  if (_.isString(col)) {
    col = window[col];
  }

  if (!(( _.isObject(col)) && 
        ( _.isObject(data)) &&
        ( _.isString(type)))) {
    console.log(col, data, type);
    throw new Error(
      "incorrect arguments to easyform. " +
      "usage: {{ easyform col=\"MyCollection\" data=this type=\"update\" options=myOptionsHelper }}"
    );
  }


  if (type === 'update') {
    tmpl = Template.easyFormUpdate;
  } else if (type === 'insert') {
    tmpl = Template.easyFormInsert;
  } else {
    throw new Error("incorrect type of easyform");
  }

  return new Handlebars.SafeString(
    tmpl({
      id: Random.id(),
      col: col,
      data: data,
      options: options
    })
  );
});

Template.easyFormUpdate.rendered = function () {
  var self = this,
      data = self.data.data,
      col = self.data.col,
      schema = col.schema,
      options = self.data.options || {},
      sel = '#' + self.data.id;

  $(sel + ' form').alpaca({
    data: data,
    schema: schema,
    options: options,
    postRender: function (renderedForm) {
      $(sel + ' button[type="submit"]').click(function () {
        if (renderedForm.isValid(true)) {
          var val = renderedForm.getValue();
          col.update({ _id: data._id }, {
            $set: val
          });
        }
      });
    }
  });
};

Template.easyFormInsert.rendered = function () {
  var self = this,
      col = self.data.col,
      schema = col.schema,
      options = self.data.options || {},
      sel = '#' + self.data.id;

  $(sel + ' form').alpaca({
    schema: schema,
    options: options,
    postRender: function (renderedForm) {
      $(sel + ' button[type="submit"]').click(function () {
        if (renderedForm.isValid(true)) {
          var val = renderedForm.getValue();
          col.insert(val);
        }
      });
    },
  });
};
