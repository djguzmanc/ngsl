import { Rule, SchematicContext, Tree, apply, url, renameTemplateFiles, template, move, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { DOMAIN_PATH, APPLICATION_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { FacadeOptions } from './schema';

export function facade(_options: FacadeOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings
      }),
      move(DOMAIN_PATH),
    ]);

    addIndexExport(
      _options.name,
      AUXILIARY_NAME,
      true,
      APPLICATION_PATH + '/facade',
      'facade',
      tree
    );

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
