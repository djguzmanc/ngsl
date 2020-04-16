import { Rule, SchematicContext, Tree, chain, externalSchematic } from '@angular-devkit/schematics';
import { parseCurrentPath } from '../../utils/current-path.utils';
import { ObservableServiceOptions } from './schema';
import { Schema } from '@schematics/angular/service/schema';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { OBSERVABLE_SERVICES_PATH } from '../../constants/paths.constant';

export function observableService(_options: ObservableServiceOptions & Schema): Rule {
  _options.flat = false;
  _options.path = OBSERVABLE_SERVICES_PATH;
  
  return chain([
    externalSchematic('@schematics/angular', 'service', _options),
    (tree: Tree, _context: SchematicContext) => {
      parseCurrentPath(tree, _options);
      addIndexExport(
        _options.name,
        AUXILIARY_NAME,
        true,
        OBSERVABLE_SERVICES_PATH,
        'service',
        tree
      );
    }
  ]);
}
