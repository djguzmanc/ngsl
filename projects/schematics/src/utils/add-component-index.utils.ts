import { Tree } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

export const addComponentIndex = (
  name: string,
  path: string,
  tree: Tree
) => {
  const importPathStack: string[] = [];
  const splittedPath = path.split('/');
  let indexFile: Buffer | null = null;
  while (splittedPath.length > 0) {
    indexFile = tree.read(`.${splittedPath.join('/')}/index.ts`);
    if (indexFile) {
      break;
    };
    importPathStack.push(splittedPath.pop()!);
  }

  if (indexFile) {
    const content = indexFile.toString();
    const indexOfClosingArray = content.indexOf('];');
    if (indexOfClosingArray < 0) {
      throw new Error(`Couldn't find and index file for the desired component.`);
    }

    const className = strings.classify(name);
    const dashName = strings.dasherize(name);
    let reversePath = importPathStack.reverse().join('/');
    reversePath = reversePath.length > 0 ? `/${reversePath}` : '';
    console.log(reversePath);

    const newContent =
      `import { ${className}Component } from '.${reversePath}/${dashName}/${dashName}.component';\n` +
      content.slice(0, indexOfClosingArray) +
      `  ${className}Component,\n` +
      content.slice(indexOfClosingArray, content.length) +
      `export * from '.${reversePath}/${dashName}/${dashName}.component';\n`;
    tree.overwrite(`${splittedPath.join('/')}/index.ts`, newContent);
  } else {
    throw new Error(`Couldn't find and index file for the desired component`);
  }
};
