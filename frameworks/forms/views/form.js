// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
//

/** @class
  FormView is a lot like a normal view. However, it automatically binds the 
  'content' of each childView to its own content and will automatically 
  transform each childView's property name into a humanized value and pass it 
  to the childView (currently, only if childView returns YES to isFormRow and 
  does not have a value for 'label').

  Usually, you will place SC.FormRowViews into the FormView:
  {{{
  childViews: "fullName gender phoneNumbers".w(),
  contentBinding: 'MyApp.personController',

  fullName: SC.FormView.row("Name:", SC.TextFieldView.extend({
    layout: {height: 20, width: 150}
  })),

  gender: SC.FormView.row("Gender:", SC.RadioView.design({
    layout: {height: 40, width: 150, centerY: 0},
    items: ["male", "female"]
  })),
  
  // phoneNumbers is a ChildArray, so use a nested form view
  phoneNumbers: SC.FormView.row("Phone Numbers", SC.FormView.nested({
    childViews: "label number".w(),
    
    label: SC.FormView.row("Label:", SC.SelectFieldView.extend({
      layout: {height: 20, width: 80},
      objects: ["home", "work", "other"]
    })),
    
    number: SC.FormView.row("Number:", SC.TextFieldView.extend({
      layout: {height: 20, width: 150})
    }))
  }))
  }}}

  The property name of the childView (ie. 'fullName'), is passed down to the 
  *FieldView, and used as the key to bind the value property to the content. 
  In this case, it will bind content.fullName to the value property of the 
  TextFieldView.

  @extends SC.View
*/

sc_require("mixins/emptiness");
sc_require("mixins/edit_mode");
sc_require("views/form_row");

SC.FormView = SC.View.extend(SC.FlowedLayout, SC.CalculatesEmptiness, SC.FormsEditMode, 
/** @scope SC.FormView.prototype */ {
  
  /** SC.Object **/
  
  init: function() {
    if (this.get('editsByDefault')) this.set('isEditing', YES);
    sc_super();
  },
  
  /** SC.FlowedLayout **/
  
  layoutDirection: SC.LAYOUT_HORIZONTAL, canWrap: YES,
  
  formFlowSpacing: SC.FROM_THEME,
  formFlowSpacingDefault: { left: 5, top: 5, bottom: 5, right: 5 },
  
  defaultFlowSpacing: function() {
    return this.themed("formFlowSpacing");
  }.property("formFlowSpacing", "theme"),
  
  /** SC.View **/
  
  classNames: ["sc-form-view"],
  
  /**
    Create the childViews and bind the content of each up appropriately.
  */
  createChildViews: function() {
    var childViews, idx, len, viewName, view, exampleRow;
    
    // keep array of viewNames so we can pass on viewName to child.
    childViews = SC.clone(this.get("childViews"));
    
    // preprocess to handle templated rows (rows that use exampleRow to initialize)
    exampleRow = this.get("exampleRow");
    for (idx = 0, len = childViews.length; idx < len; idx++) {
      viewName = childViews[idx];
      if (SC.typeOf(viewName) === SC.T_STRING) {
        view = this.get(viewName);
        if (view && !view.isClass && SC.typeOf(view) === SC.T_HASH) {
          this[viewName] = exampleRow.extend(view);
        }
      }
    }
    
    // We need to add in contentValueKey before we call sc_super
    for (idx = 0; idx < len; idx++) {
      viewName = childViews[idx];
      if (SC.typeOf(viewName) === SC.T_STRING) {
        view = this.get(viewName);
        if (!view.prototype.contentValueKey) {
          view.prototype.contentValueKey = viewName ;
        }
      }
    }
  
    sc_super();
    
    // now, do the actual passing it
    for (idx = 0; idx < len; idx++) {
      viewName = childViews[idx];
      
      // if the view was originally declared as a string, then we have something to give it
      if (SC.typeOf(viewName) === SC.T_STRING) {
        // try to get the actual view
        view = this.get(viewName);
        
        // see if it does indeed exist, and if it doesn't have a value already
        if (view && !view.isClass) {
          // set content
          if (!view.get("content")) {
            view.bind('content', '.parentView.content') ;
          }
          
          // set the label size measuring stuff
          if (this.get("labelWidth") !== null) view.set("shouldMeasureLabel", NO);
          
          // set label (if possible)
          if (view.get("isFormRow") && SC.none(view.get("label"))) {
            view.set("label", viewName.humanize().titleize());
          }
        }
      }
    }
    
    // our internal bookeeping to prevent .
    this._hasCreatedRows = YES;
    this.recalculateLabelWidth();
  },

  createRenderer: function(theme) { 
    return theme.form();
  },
  
  updateRenderer: function(renderer) {},
  
  /** SC.FormView **/

  /**
    The content to bind the form to. This content object is passed to all
    children.
  
    All child views, if added at design time via string-based childViews array,
    will get their contentValueKey set to their string.
  */
  content: null,
  
  /**
  Whether to automatically start editing.
  */
  editsByDefault: YES,
  
  /**
    Rows in the form do not have to be full objects at load time. They can
    also be simple hashes which are then passed to exampleRow.extend.
  */
  exampleRow: SC.FormRowView.extend({
    labelView: SC.FormRowView.LabelView.extend({ textAlign: SC.ALIGN_RIGHT })
  }),
  
  /**
    Allows rows to use this to track label width.
  */
  isRowDelegate: YES,
  
  /**
    The manually specified label width (null to automatically calculate, 
    which is the default).
  */
  labelWidth: null,
  
  /**
    Calculates the current label width (if labelWidth is not null, it sets
    using the label width)
  */
  recalculateLabelWidth: function() {
    var ret, childViews, idx, len, child;
    
    if (!this._hasCreatedRows) return;
    
    childViews = this.get("childViews");
    len = childViews.length;
      
    // calculate by looping through child views and getting size (if possible)
    ret = this.get("labelWidth");
    if (ret === null) {
      ret = 0;
      for (idx = 0; idx < len; idx++) {
        child = childViews[idx];
      
        // if it has a measurable row label
        if (child.get("rowLabelMeasuredSize")) {
          ret = Math.max(child.get("rowLabelMeasuredSize"), ret);
        }
      }
    }
    
    // now set for all children
    if (this._rowLabelSize !== ret) {
      this._rowLabelSize = ret;
      
      // set by looping throuhg child views
      for (idx = 0; idx < len; idx++) {
        child = childViews[idx];

        // if it has a measurable row label
        if (child.get("hasRowLabel")) {
          child.set("rowLabelSize", ret);
        }
      }
      
    }
  },
  
  /**
    Rows call this when their label width changes.
  */
  rowLabelMeasuredSizeDidChange: function(row, labelSize) {
    this.invokeOnce("recalculateLabelWidth");
  }
});

SC.mixin(SC.FormView, {
  /**
  Creates a form row.

  Can be called in two ways: row(optionalClass, properties), which creates
  a field with the properties, and puts it in a new row;
  and row(properties), which creates a new row—and it is up to you to add
  any fields you want in the row.
  
  You can also supply some properties to extend the row itself with.
  */
  row: function(optionalClass, properties, rowExt) {
    return SC.FormRowView.row(optionalClass, properties, rowExt);
  },
  
  /**
  Creates a nested form for use with a ChildRecord or ChildArray.
  
  Nested forms are a subclass of SC.FormView, that automatically create child 
  SC.FormViews as needed, each designed with the templateProperties provided.
  */
  nested: function(templateProperties, properties) {
    properties = properties ? properties : {};
    
    // Assign some standard attributes for template forms
    templateProperties.classNames = ['sc-nested-form'];
    templateProperties.flowSize = templateProperties.flowSize ? templateProperties.flowSize : { widthPercentage: 1 };
    
    properties.templateProperties = templateProperties;

    return SC.NestedFormView.design(properties);
  }
});