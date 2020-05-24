import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  renameTemplateFiles,
  template,
  move,
  mergeWith
} from '@angular-devkit/schematics';
import { SharableModuleOptions } from './schema';
import { strings } from '@angular-devkit/core';
import { toUpperCase } from '../../utils/strings.utils';
import { parseCurrentPath } from '../../utils/current-path.utils';

export function sharedModule(_options: SharableModuleOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const parsedPath = parseCurrentPath(tree, _options);

    const sourceParametrizedTemplates = apply(url('./files'), [
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
