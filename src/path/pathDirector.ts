import { Dir, Vector } from "./vector";
import { RelativeSize } from "shared/types";
import { IDir } from "../types";

interface Rule<Input, Result> {
  instructions: (input: Input) => Result;
  condition: () => boolean;
}

interface RuleDirector<Input, Result> {
  rules: Rule<Input, Result>[];

  constructor(rules: Rule<Input, Result>[]);

  resolve(context: Input): Result;
}

class AnchorChooser implements RuleDirector<{ start: Vector; end: Vector }, { startDir: Dir; endDir: Dir }> {
  rules: AnchorRole[];

  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  resolve(c: { start: Vector; end: Vector }) {
    const rule = this.rules.find((rule) => rule.condition(args));
    if (rule) return rule.instructions(args);
    return null;
  }
}

/**
 * This class is used to parse the path roles string and determine the path behavior
 *
 * Example:
 *  const pathDirector = new PathDirector([
 *    [()=>true,(vectors)=>{return [vectors.up,vectors.down]}],
 *    [()=>true,"S 20sd 100%-40f E-20ed E"]
 *   ]);
 */
class PathDirector {
  pathRoles: PathRole[];
  context: PathDirectorContext | null = null;

  axes: Dir[];
  anchorsDirsRules?: AnchorRole[];

  constructor(
    // roles: PathRoleInitiator[], anchorsDirsChooser?: AnchorsDirsChooser, options: { axes?: IDir[] } = { axes: [xDir, yDir] })
    args: { roles: PathRoleInitiator[]; anchorsDirsRules?: AnchorRole[]; options?: { axes?: IDir[] } }
  ) {
    const { anchorsDirsRules, options = {} } = args;
    options.axes ??= [xDir, yDir];
    // this.pathRoles = roles.map((role) => {
    //   if (typeof role.instructions === "string") {
    //     return {
    //       condition: role.condition,
    //       instructions: this.parseStringInstruction(role.instructions),
    //     };
    //   }
    //   return role as PathRole;
    // });

    this.axes = options.axes.map((axis) => new Dir(axis.x, axis.y));
    this.anchorsDirsRules = anchorsDirsRules;
  }

  initContext(context: { start: Vector; end: Vector }) {
    const { start, end } = context;
    const forward = end.sub(start).dir();
    const sidewards = forward.rotate(90);
    const major = forward.biggestProjection(this.axes);
    const minor = forward.smallestProjection(this.axes);
    const c = {
      Start: start,
      S: start,
      End: end,
      E: end,

      x: xDir,
      y: yDir,
      forward,
      f: forward,
      forwardPerpendicular: sidewards,
      fp: sidewards,
      major,
      j: major,
      minor,
      n: minor,
    };
    const { startDir, endDir } = this.anchorsDirsRules?.(c) ?? {
      startDir: start.trailingDir?.[0] ?? forward,
      endDir: start.trailingDir?.[0] ?? forward,
    };
    this.context = {
      ...c,
      startDir,
      sd: startDir,
      startDirPerpendicular: startDir.rotate(90),
      sdp: startDir.rotate(90),
      endDir,
      ed: endDir,
      endDirPerpendicular: endDir.rotate(90),
      edp: endDir.rotate(90),
    };
  }

  // private parseStringInstruction(instruction: string): PathRoleFuncInstructions {
  //   // todo
  //   return undefined as any;
  // }
}

const xDir = new Dir(1, 0);
const yDir = new Dir(0, 1);

const defaultPathDirector = new PathDirector({
  roles: [],
  anchorsDirsRules: (c) => {
    // context.
    const startDir = c.Start.chooseDir(c.forward) ?? c.forward;
    let endDir = c.End.chooseDir(c.forward) ?? c.forward;
    return { startDir, endDir };
  },
  options: { axes: [xDir, yDir] },
});

// vectors
type PathCommandVectors =
  | "Start" //
  | "End"
  | "S"
  | "E";

// these directions are fixed and determined by the start and end points
type PathCommandDirections =
  | "x"
  | "y"
  | "forward"
  | "f"
  | "forwardPerpendicular" // sidewards clockwise from forward
  | "fp" // shorthand for forwardPerpendicular
  | "major"
  | "j"
  | "minor"
  | "n";
// these directions are determined dynamically by the path and chosen by the pathRoles
type PathCommandDirectionsDynamic =
  | "startDir" //
  | "sd"
  | "startDirPerpendicular"
  | "sdp"
  | "endDir"
  | "ed"
  | "endDirPerpendicular"
  | "edp";

type PathCommand = PathCommandVectors | PathCommandDirections | PathCommandDirectionsDynamic;

export type PathDirectorContext = {
  // [key in PathCommand]: Vector;
  x: Dir;
  y: Dir;
  forward: Dir;
  f: Dir;
  forwardPerpendicular: Dir;
  fp: Dir;
  major: Dir;
  j: Dir;
  minor: Dir;
  n: Dir;
  startDir: Dir;
  sd: Dir;
  startDirPerpendicular: Dir;
  sdp: Dir;
  endDir: Dir;
  ed: Dir;
  endDirPerpendicular: Dir;
  edp: Dir;
  Start: Vector;
  S: Vector;
  End: Vector;
  E: Vector;
};

type PathRole = {
  instructions: PathRoleFuncInstructions;
  condition?: PathRoleCondition;
};

type PathRoleInitiator = {
  instructions: PathRoleInstruction;
  condition?: PathRoleCondition;
};

type PathRoleCondition = (vectors: PathDirectorContext) => boolean;
type PathRoleInstruction = PathRoleFuncInstructions | PathRoleStringInstructions;
type PathRoleFuncInstructions = (vectors: PathDirectorContext) => Vector[];
type PathRoleStringInstructions = string;
type PathRoleStringInstruction = `${Exclude<RelativeSize, number>}${PathCommand}`;

type EdgeVectors = { start: Vector; end: Vector };
type EdgeDirs = { startDir: Dir; endDir: Dir };
type AnchorRole = {
  instructions: AnchorsDirsInstructions;
  condition?: PathRoleCondition;
};
type AnchorsDirsInstructions = (context: Pick<PathDirectorContext, PathCommandVectors | PathCommandDirections>) => EdgeDirs;

export default PathDirector;
