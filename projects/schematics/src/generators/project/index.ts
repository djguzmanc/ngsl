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
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

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

    const angularJsonFilePath: string = 'angular.json';
    const angularJson: Buffer | null = tree.read(angularJsonFilePath);
    let angularJsonContent: any = {};
    if (angularJson) {
      angularJsonContent = JSON.parse(angularJson.toString());
    }

    const defaultProjectName: string = angularJsonContent.defaultProject;

    const defaultStylesPath = 'src/styles.scss';
    const customStylesPath = 'src/scss/styles.scss';

    let stylesPathIndex: number = -1;
    let stylesArray = (angularJsonContent.projects[defaultProjectName]
      .architect.build.options.styles as string[]);
    stylesPathIndex = stylesArray.indexOf(defaultStylesPath);

    if (stylesPathIndex > -1) {
      stylesArray[stylesPathIndex] = customStylesPath;
    }

    stylesPathIndex = -1;
    stylesArray = (angularJsonContent.projects[defaultProjectName]
      .architect.test.options.styles as string[]);
    stylesPathIndex = stylesArray.indexOf(defaultStylesPath);

    if (stylesPathIndex > -1) {
      stylesArray[stylesPathIndex] = customStylesPath;
    }

    // Delete old styles file
    const oldStylePath = `/src/styles.scss`;
    if (tree.exists(oldStylePath)) {
      tree.delete(oldStylePath);
    }

    // Add style preprocessor options
    angularJsonContent.projects[defaultProjectName]
      .architect.build.options.stylePreprocessorOptions = {
      includePaths: [
        'src/scss/tools',
        'src/scss/settings'
      ]
    }

    tree.overwrite(angularJsonFilePath, JSON.stringify(angularJsonContent, null, 2));

    const packageJsonFilePath: string = 'package.json';
    const packageJson: Buffer | null = tree.read(packageJsonFilePath);
    let packageJsonContent: any = {};
    if (packageJson) {
      packageJsonContent = JSON.parse(packageJson.toString());
    }

    packageJsonContent.devDependencies['pre-commit'] = '^1.2.2';
    packageJsonContent['pre-commit'] = [
      'lint'
    ];

    tree.overwrite(packageJsonFilePath, JSON.stringify(packageJsonContent, null, 2));

    _context.addTask(new NodePackageInstallTask());

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
