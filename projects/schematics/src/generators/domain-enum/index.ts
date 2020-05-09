import { Rule, chain, externalSchematic } from '@angular-devkit/schematics';
import { DomainEnumOptions } from './schema';
import { EnumOptions } from '../enum/schema';
import { DOMAIN_ENUMS_PATH } from '../../constants/paths.constant';
import { EXCLUDE_NAME } from '../../constants/name.constant';

export function domainEnum(_options: DomainEnumOptions): Rule {
  return chain([
    externalSchematic('@ngsl/schematics', 'ngsl-enum', {
      name: _options.name,
      path: DOMAIN_ENUMS_PATH,
      group: EXCLUDE_NAME
    } as EnumOptions),
  ]);
}
