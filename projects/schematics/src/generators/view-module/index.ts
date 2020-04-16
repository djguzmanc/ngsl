import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  renameTemplateFiles,
  template,
  mergeWith,
  move,
  filter
} from '@angular-devkit/schematics';
import { ViewModuleOptions } from './schema';
import { strings } from '@angular-devkit/core';
import { toUpperCase } from '../../utils/strings.utils';
import { parseCurrentPath } from '../../utils/current-path.utils';

export function viewModule(_options: ViewModuleOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const parsedPath = parseCurrentPath(tree, _options);
    _options.wrapper_path = _options.wrapper_path || strings.dasherize(_options.name);

    const sourceParametrizedTemplates = apply(url('./files'), [
      filter(path => _options.wrapper ? true : !path.match(/wrapper\.component/i)),
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings,
        toUpperCase
      }),
      move(parsedPath.path)
    ]);

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
