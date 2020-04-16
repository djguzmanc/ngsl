import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  move,
  renameTemplateFiles
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { ControllerOptions } from './schema';
import { SERVICES_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';

export function controller(_options: ControllerOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings
      }),
      move(SERVICES_PATH),
    ]);

    addIndexExport(
      _options.name,
      AUXILIARY_NAME,
      true,
      SERVICES_PATH + '/api',
      'service',
      tree,
      '-api'
    );

    addIndexExport(
      _options.name,
      AUXILIARY_NAME,
      true,
      SERVICES_PATH + '/facade',
      'facade',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
