import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { parseCurrentPath } from '../../utils/current-path.utils';
import { ModelOptions } from './schema';
import { Schema } from '@schematics/angular/class/schema';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME, EXCLUDE_NAME } from '../../constants/name.constant';
import { DOMAIN_ENTITIES_PATH, DOMAIN_INTERFACES_PATH } from '../../constants/paths.constant';
import { InterfaceOptions } from '../interface/schema';

export function model(_options: ModelOptions & Schema): Rule {
  const originalName = _options.name;
  _options.name = `${_options.name}/${_options.name}`;
  _options.path = DOMAIN_ENTITIES_PATH;

  return chain([
    _options.singleInterface ? () => { } :
      externalSchematic('@schematics/angular', 'class', _options),
    _options.useInterface || _options.singleInterface ?
      externalSchematic('@ngsl/schematics', 'ngsl-interface', {
        name: originalName,
        path: DOMAIN_INTERFACES_PATH,
        group: EXCLUDE_NAME
      } as InterfaceOptions) : () => { },
    (tree: Tree, _context: SchematicContext) => {
      parseCurrentPath(tree, _options);
      if (!_options.singleInterface) {
        addIndexExport(
          _options.name,
          AUXILIARY_NAME,
          true,
          DOMAIN_ENTITIES_PATH,
          'empty',
          tree
        );
      }
    }
  ]);
}
