/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import { tsquery } from "@phenomnomnominal/tsquery";
import * as Lint from "tslint";
import * as ts from "typescript";
import * as peer from "../support/peer";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    deprecationMessage: peer.v5 ? peer.v5NotSupportedMessage : undefined,
    description:
      "Disallows using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.",
    options: null,
    optionsDescription: "Not configurable.",
    requiresTypeInfo: false,
    ruleName: "rxjs-no-ignored-replay-buffer",
    type: "functionality",
    typescriptOnly: false
  };

  public static FAILURE_STRING = "Ignoring the buffer size is forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const failures: Lint.RuleFailure[] = [];

    const newIdentifiers = tsquery(
      sourceFile,
      `NewExpression > Identifier[name="ReplaySubject"]`
    );
    newIdentifiers.forEach(identifier => {
      const newExpression = identifier.parent as ts.NewExpression;
      if (!newExpression.arguments || newExpression.arguments.length === 0) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });

    const nestedNewIdentitiers = tsquery(
      sourceFile,
      `NewExpression PropertyAccessExpression Identifier[name="ReplaySubject"]`
    );
    nestedNewIdentitiers.forEach(identifier => {
      const newExpression = identifier.parent.parent as ts.NewExpression;
      if (!newExpression.arguments || newExpression.arguments.length === 0) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });

    const callIdentifiers = tsquery(
      sourceFile,
      `CallExpression Identifier[name=/(publishReplay|shareReplay)/]`
    );
    callIdentifiers.forEach(identifier => {
      const callExpression = identifier.parent as ts.CallExpression;
      if (callExpression.arguments.length === 0) {
        failures.push(
          new Lint.RuleFailure(
            sourceFile,
            identifier.getStart(),
            identifier.getStart() + identifier.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName
          )
        );
      }
    });
    return failures;
  }
}
