import { Rule, SchematicContext, Tree, apply, url, renameTemplateFiles, template, move, mergeWith } from '@angular-devkit/schematics';
import { EnumOptions } from './schema';
import { strings } from '@angular-devkit/core';
import { ENUMS_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { placeName } from '../../utils/nullable-name.utils';

export function _enum(_options: EnumOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings,
        placeName,
        AUXILIARY_NAME
      }),
      move(ENUMS_PATH),
    ]);

    addIndexExport(
      _options.name,
      _options.group,
      false,
      ENUMS_PATH + `/${_options.group}`,
      'enum',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
