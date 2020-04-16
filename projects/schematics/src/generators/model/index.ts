import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { parseCurrentPath } from '../../utils/current-path.utils';
import { ModelOptions } from './schema';
import { Schema } from '@schematics/angular/class/schema';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { MODELS_PATH } from '../../constants/paths.constant';

export function model(_options: ModelOptions & Schema): Rule {
  _options.name = `${_options.name}/${_options.name}`;
  _options.path = MODELS_PATH;

  return chain([
    externalSchematic('@schematics/angular', 'class', _options),
    (tree: Tree, _context: SchematicContext) => {
      parseCurrentPath(tree, _options);
      addIndexExport(
        _options.name,
        AUXILIARY_NAME,
        true,
        MODELS_PATH,
        'empty',
        tree
      );
    }
  ]);
}
