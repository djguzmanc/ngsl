import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { parseCurrentPath } from '../../utils/current-path.utils';
import { addComponentIndex } from '../../utils/add-component-index.utils';
import { ComponentOptions } from './schema';
import { Schema } from '@schematics/angular/component/schema';

export function component(_options: ComponentOptions & Schema): Rule {
  _options.skipImport = true;
  _options.flat = false;

  return chain([
    externalSchematic('@schematics/angular', 'component', _options),
    (tree: Tree, _context: SchematicContext) => {
      parseCurrentPath(tree, _options);
      addComponentIndex(_options.name, _options.path!, tree);
    }
  ]);
}
