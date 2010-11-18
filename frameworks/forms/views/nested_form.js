// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
//

sc_require("views/form");

SC.NestedFormView = SC.FormView.extend(
/** @scope SC.NestedFormView.prototype */
{
  /** SC.Object **/
  init: function() {
    // When our content changes rebuild our childviews
    this.addObserver('content', this, 'buildChildViews');
    
    sc_super();
  },
  
  /** SC.View **/
  classNames: ["sc-nested-form-view"],
  
  exampleForm: SC.FormView.extend({}),

  buildChildViews: function() {
    var content,            // our content
        templateForm,       // template form that will be created for each child record
        childForms,         // the array of created SC.FormViews 
        childForm;          // current SC.FormView being created
        
    content = this.get('content');
    templateForm = this.get('exampleForm');
    childForms = [];

    // For enumerable content, create templates for each item
    if (content.get('isEnumerable')) {
      // Observe changes to the content items
      if (!content.hasObserverFor('[]')) content.addObserver('[]', this, 'buildChildViews');

      content.forEach(function(contentObject) {
        // Create a new form based on the template
        childForm = templateForm.create(this.templateProperties);
        childForm.set('content', contentObject);

        childForms.pushObject(childForm);
      }, this);

    // Else create a single template
    } else {
      // Create a new form based on the template
      childForm = templateForm.create(this.templateProperties);
      childForm.set('content', content);

      childForms.pushObject(childForm);
    }

    // This could be optimized further, but for now just replace all children
    this.replaceAllChildren(childForms);

    // SC.FlowedLayout doesn't observe changes to childViews so update it manually
    this.invokeOnce("_scfl_tile");
  }
});
