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
import { strings } from '@angular-devkit/core';
import { INTERFACES_PATH } from '../../constants/paths.constant';
import { InterfaceOptions } from './schema';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { placeName } from '../../utils/nullable-name.utils';

export function _interface(_options: InterfaceOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings,
        placeName,
        AUXILIARY_NAME
      }),
      move(INTERFACES_PATH),
    ]);

    addIndexExport(
      _options.name,
      _options.group,
      false,
      INTERFACES_PATH + `/${_options.group}`,
      'interface',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
