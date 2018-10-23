import { assignIn } from 'lodash'

Handlebars.registerHelper('include', function (template, params) {
  return new Handlebars.SafeString((Handlebars.partials[template])(_.assignIn({}, this, params.hash)));
});
