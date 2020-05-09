import { Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { AUXILIARY_NAME, EXCLUDE_NAME } from '../constants/name.constant';

export const addIndexExport = (
  name: string,
  group: string,
  insideFolder: boolean,
  path: string,
  templateTypeName: 'interface' | 'component' | 'enum' | 'empty' | 'service' | 'facade',
  tree: Tree,
  nameSuffix: string = ''
) => {
  const indexFile: Buffer | null = tree.read(`.${path}/index.ts`);
  let indexFileContent: string = '';
  if (indexFile) {
    indexFileContent = indexFile.toString();
  };

  const dasherizedName = strings.dasherize(name);
  const contentToAppend = `export * from '.${ insideFolder ? '/' + dasherizedName : '' }/${dasherizedName + nameSuffix}${ (group !== AUXILIARY_NAME && group !== EXCLUDE_NAME) ? '-' + group : '' }${ templateTypeName !== 'empty' ? '.' + templateTypeName : '' }';\n`;
  const newContent = indexFileContent + contentToAppend;

  if (!indexFile) {
    tree.create(`.${path}/index.ts`, '');
  };
  tree.overwrite(`.${path}/index.ts`, newContent);
}