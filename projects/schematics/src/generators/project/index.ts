import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  renameTemplateFiles,
  template,
  mergeWith,
  forEach
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export function project(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceParametrizedTemplates = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ..._options,
        ...strings
      }),
      forEach(fileEntry => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        } else {
          tree.create(fileEntry.path, fileEntry.content);
        }
        return null;
      })
    ]);

    const angularJson: Buffer | null = tree.read('angular.json');
    let angularJsonContent: string = '';
    if (angularJson) {
      angularJsonContent = angularJson.toString();
    }

    // Delete old styles file
    const oldStylePath = `/src/styles.scss`;
    if (tree.exists(oldStylePath)) {
      tree.delete(oldStylePath);
    }

    // Fix styles url
    angularJsonContent = angularJsonContent.replace('src/styles.scss', 'src/scss/styles.scss');

    // Add style preprocessor options
    const indexOfScripts = angularJsonContent.indexOf('"scripts": []');
    angularJsonContent =
      angularJsonContent.slice(0, indexOfScripts) +
      `"stylePreprocessorOptions": {
              "includePaths": [
                "src/scss"
              ]
            },
            ` +
      angularJsonContent.slice(indexOfScripts, angularJsonContent.length);

    tree.overwrite('angular.json', angularJsonContent);

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
