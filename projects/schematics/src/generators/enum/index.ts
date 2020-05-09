import { Rule, SchematicContext, Tree, apply, url, renameTemplateFiles, template, move, mergeWith } from '@angular-devkit/schematics';
import { EnumOptions } from './schema';
import { strings } from '@angular-devkit/core';
import { ENUMS_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME, EXCLUDE_NAME } from '../../constants/name.constant';
import { placeName } from '../../utils/nullable-name.utils';

export function _enum(_options: EnumOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _options.path = _options.path || ENUMS_PATH;
    const pathFix: string = _options.group !== EXCLUDE_NAME ? `/${_options.group}` : '';
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings,
        placeName,
        AUXILIARY_NAME,
        EXCLUDE_NAME
      }),
      move(_options.path + pathFix),
    ]);

    addIndexExport(
      _options.name,
      _options.group,
      false,
      _options.path + pathFix,
      'enum',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
