import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  renameTemplateFiles,
  template,
  mergeWith,
  move
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { CLASSES_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { ClassOptions } from './schema';
import { AUXILIARY_NAME } from '../../constants/name.constant';

export function _class(_options: ClassOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings
      }),
      move(CLASSES_PATH)
    ]);

    addIndexExport(
      _options.name,
      AUXILIARY_NAME,
      true,
      CLASSES_PATH,
      'empty',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
