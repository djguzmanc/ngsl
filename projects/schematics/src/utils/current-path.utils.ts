import { getWorkspace } from '@schematics/angular/utility/config';
import { getProject, buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName, Location } from '@schematics/angular/utility/parse-name';
import { Tree } from '@angular-devkit/schematics';

export const parseCurrentPath = (tree: Tree, _options: any): Location => {
  const workspace = getWorkspace(tree);
  const projectName = Object.keys(workspace.projects)[0];
  const project = getProject(tree, projectName);

  if (_options.path === undefined) {
    _options.path = buildDefaultPath(project);
  }

  const parsedPath = parseName(_options.path, _options.name);
  _options.name = parsedPath.name;
  _options.path = parsedPath.path;

  return parsedPath;
};
