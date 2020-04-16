import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic
} from '@angular-devkit/schematics';
import { PageOptions } from './schema';
import { Schema } from '@schematics/angular/component/schema';
import { parseCurrentPath } from '../../utils/current-path.utils';
import { addComponentIndex } from '../../utils/add-component-index.utils';

export function page(_options: PageOptions & Schema): Rule {
  _options.skipSelector = true;
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
