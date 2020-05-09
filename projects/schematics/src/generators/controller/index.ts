import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  move,
  renameTemplateFiles,
  chain,
  externalSchematic
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { ControllerOptions } from './schema';
import { DOMAIN_PATH, INFRASTRUCTURE_PATH, APPLICATION_PATH } from '../../constants/paths.constant';
import { addIndexExport } from '../../utils/index-export.utils';
import { AUXILIARY_NAME } from '../../constants/name.constant';
import { InterfaceOptions } from '../interface/schema';

export function controller(_options: ControllerOptions): Rule {
  return chain([
    externalSchematic('@ngsl/schematics', 'ngsl-interface', {
      name: _options.name,
      group: 'controller'
    } as InterfaceOptions),
    (tree: Tree, _context: SchematicContext) => {
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
        INFRASTRUCTURE_PATH + '/api',
        'service',
        tree,
        '-api'
      );

      addIndexExport(
        _options.name,
        AUXILIARY_NAME,
        true,
        APPLICATION_PATH + '/facade',
        'facade',
        tree
      );

      return mergeWith(sourceParametrizedTemplates)(tree, _context);
    }
  ]);
}
