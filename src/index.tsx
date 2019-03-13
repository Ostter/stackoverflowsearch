import {
  JupyterLab,
  JupyterLabPlugin,
  ILayoutRestorer
} from "@jupyterlab/application";
import { ICommandPalette, InstanceTracker } from "@jupyterlab/apputils";
import { Widget } from "@phosphor/widgets";
// import { Message } from "@phosphor/messaging";
import { JSONExt } from "@phosphor/coreutils";

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

import "../style/index.css";

/**
 * An search viewer.
 */
class SearchWidget extends Widget {
  /**
   * Construct a new search widget.
   */
  constructor() {
    super();

    this.id = "stackoverflow-jl";
    this.title.label = "Stackoverflow";
    this.title.closable = true;
    this.addClass("searchWidget");

    this.rootReact = document.createElement("div");
    this.rootReact.setAttribute("id", "rootReact");
    this.node.appendChild(this.rootReact);
  }

  /**
   * The div element associated with the widget.
   */
  readonly rootReact: HTMLDivElement;

  // /**
  //  * Handle update requests for the widget.
  //  */
  // onUpdateRequest(msg: Message): void {
  //   ReactDOM.render(<App />, document.getElementById("rootReact") as HTMLElement);
  // }
  onActivateRequest(): void {
    ReactDOM.render(<App />, document.getElementById(
      "rootReact"
    ) as HTMLElement);
  }
}

/**
 * Activate the xckd widget extension.
 */
function activate(
  app: JupyterLab,
  palette: ICommandPalette,
  restorer: ILayoutRestorer
) {
  // Declare a widget variable
  let widget: SearchWidget;

  // Add an application command
  const command: string = "stackoverflow:open";
  app.commands.addCommand(command, {
    label: "Stackoverflow",
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new SearchWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: "Custom" });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: "stackoverflow" });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => "stackoverflow"
  });
}

/**
 * Initialization data for the ext_search extension.
 */

const extension: JupyterLabPlugin<void> = {
  id: "stackoverflow_search",
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
