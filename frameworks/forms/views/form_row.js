// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
//

/** @class
  Represents a single row in a form. Rows have a label and a single child view
  whose content will be bound to the parentView's content and whose value will
  be bound to the content by the contentValueKey either specified or passed by 
  the parent form view.
  
  However, if the child view is a SC.FormView or subclass, the content will
  instead be bound to the parentView's content's property for contentValueKey.

  @extends SC.View
*/
sc_require("mixins/emptiness");
sc_require("mixins/edit_mode");

SC.FormRowView = SC.View.extend(SC.FlowedLayout, SC.CalculatesEmptiness, SC.FormsEditMode,
/** @scope Forms.FormRowView.prototype */ {
  
  /** SC.FlowedLayout **/
  
  flowSize: { widthPercentage: 1 },

  rowFlowSpacing: SC.FROM_THEME,
  rowFlowSpacingDefault: { right: 15, left: 0, top: 0, bottom: 0 },
  
  rowFlowPadding: SC.FROM_THEME,
  rowFlowPaddingDefault: { right: 0, left: 0, top: 0, bottom: 0 },
  
  defaultFlowSpacing: function() {
    return this.themed("rowFlowSpacing");
  }.property("rowFlowSpacing", "theme"),
  
  flowPadding: function() {
    return this.themed("rowFlowPadding");
  }.property("rowFlowPadding", "theme"),
  
  /**
    Direction of the flow.
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,
  
  /** SC.View **/
  
  classNames: ["sc-form-row-view"],
  
  createChildViews: function() {
    var childViews, viewName, view, contentValueKey, idx, len;
    
    // keep array of keys so we can pass on key to child.
    childViews = SC.clone(this.get("childViews"));
    
    // add label
    if (this.labelView.isClass) {
      this.labelView = this.createChildView(this.labelView, {
        value: this.get("label")
      });
      this.labelView.addObserver("measuredSize", this, "labelSizeDidChange");
      this.labelView.bind("shouldMeasureSize", this, "shouldMeasureLabel");
      this.get("childViews").unshift(this.labelView);
    }
    
    sc_super();
    
    for (idx = 0, len = childViews.length; idx < len; idx++) {
      viewName = childViews[idx];
      
      // if the view was originally declared as a string, then we have something to give it
      if (SC.typeOf(viewName) === SC.T_STRING) {
        // try to get the actual view
        view = this.get(viewName);
        
        // see if it does indeed exist, and if it doesn't have a value already
        if (view && !view.isClass) {
          if (!view.get("contentValueKey")) {
            //
            // NOTE: WE HAVE A SPECIAL CASE
            //  If this is the single field, pass through our contentValueKey
            if (viewName === "_singleField")  {
              view.set("contentValueKey", this.get("contentValueKey"));
            } else {
              view.set("contentValueKey", viewName);
            }
          }
          
          contentValueKey = view.get('contentValueKey') ;
          
          // If the view is a nested form, bind the nested form's content to the 'contentValueKey'
          if (SC.kindOf(view, SC.FormView)) {
            if (!view.get("content")) {
              view.bind('content', '.parentView*content.'+contentValueKey) ;
            }
          } else {
            if (!view.get("content")) {
              view.bind('content', '.parentView.content') ;
            }
            
            // Bind the value property of the view to the 'contentValueKey' property of content.
            if (contentValueKey && !view.get('value')) {
              view.bind('value', '.content'+contentValueKey) ;
            }
          }
        }
      }
    }
  },
  
  createRenderer: function(theme) { 
    return theme.formRow();
  },
  
  updateRenderer: function(renderer) {},
  
  /** SC.FormRowView **/
  
  /**
    Walks like a duck.
  */
  isFormRow: YES,
  
  /**
    The label for the row (string label)
  */
  label: "",
  
  /**
    The current size of the labels.
  */
  rowLabelSize: 0,
  
  /**
    The current measured size of the label.
  */
  rowLabelMeasuredSize: 0,
  
  /**
    If NO, the label will not automatically measure itself.
  */
  shouldMeasureLabel: YES,
  
  /**
    A value set so that FormView knows to tell us about the row label size change.
  */
  hasRowLabel: YES,
  
  /**
    The label view.
  */
  labelView: null,
  
  labelDidChange: function() {
    this.get("labelView").set("value", this.get("label"));
  }.observes("label"),
  
  labelSizeDidChange: function() {
    var size, parentView;
    
    size = this.get("labelView").get("measuredSize");
    this.set("rowLabelMeasuredSize", size.width);
    
    // alert parent view if it is a row delegate
    parentView = this.get("parentView");
    if (parentView && parentView.get("isRowDelegate")) {
      parentView.rowLabelMeasuredSizeDidChange(this, size);
    }
  },
  
  rowLabelSizeDidChange: function() {
    this.get("labelView").adjust({
      "width": this.get("rowLabelSize")
    });
  }.observes("rowLabelSize")
  
});

SC.FormRowView.mixin({
  row: function(label, fieldType, ext) {
    if (label.isClass) {
      ext = fieldType;
      fieldType = label;
      label = null;
    }
    // now, create a hash (will be used by the parent form's exampleRow)
    if (!ext) {
      ext = {};
    } else {
      ext = SC.clone(ext);
    }
    ext.label = label;
    ext.childViews = ["_singleField"];
    ext._singleField = fieldType;
    return ext;
  },
  
  LabelView: SC.LabelView.extend(SC.AutoResize, SC.CalculatesEmptiness, {
    shouldAutoResize: NO, // only change the measuredSize so we can update.
    layout: { left:0, top:0, width: 0, height: 18 },
    classNames: ["sc-form-label"],
    isValue: NO
  })
});

SC.FormRowView.prototype.labelView = SC.FormRowView.LabelView.design();
