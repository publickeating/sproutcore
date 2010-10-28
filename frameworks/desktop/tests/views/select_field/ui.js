// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            portions copyright @2009 Apple Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test htmlbody ok equals same stop start */

htmlbody('<style> .sc-static-layout { border: 1px red dotted; } </style>');

var objectObjects = [{title: "Apple", pos: 0},{title: "Sproutcore 1.0", pos: 1},{title: "Development", pos: 2},{title: "Charles", pos: 3}];

objectObjects = objectObjects.map(function(object) {
  object.toString = function() {return this.title;};
  return object;
});

var pane = SC.ControlTestPane.design()
    // .add("basic", SC.SelectFieldView, { 
    //       objects:["1","2","3","4","5"]
    //    })
    //  
    //    .add("disabled", SC.SelectFieldView, { 
    //      isEnabled: NO, objects:["1","2","3","4","5"]
    //    })
    //  
    //    .add("Not Selected", SC.SelectFieldView, { 
    //      isSelected: NO, objects:["1","2","3","4","5"]
    //    })
    //  
    //    .add("Not Visible", SC.SelectFieldView, { 
    //      isVisible: NO, objects:["1","2","3","4","5"]
    //    })
    //  
    //    .add("sortedStringOptions", SC.SelectFieldView, { 
    //      objects:["Apple","Sproutcore 1.0","Development","Charles"],
    //  useStaticLayout: YES, 
    //      layout: { width: 'auto', right: 'auto' }
    //    })
    //      .add("unSortedStringOptions", SC.SelectFieldView, { 
    //        objects:["Apple","Sproutcore 1.0","Development","Charles"],
    //    useStaticLayout: YES, 
    //    disableSort: YES,
    //        layout: { width: 'auto', right: 'auto' }
    //      })
    //  
    //    .add("Width 150 Right 0", SC.SelectFieldView, { 
    //      objects: [1,6,11,2,8],
    //      useStaticLayout: YES, 
    //      layout: { width: '150', right: '0' }
    //    })
    //  .add("redraw", SC.SelectFieldView, { 
    //    useStaticLayout: YES, 
    //    layout: { width: '150', right: '0' }
    //  })
  .add("Object objects", SC.SelectFieldView, {
    objects: objectObjects,
    nameKey: 'title',
    value: objectObjects[2]
  });
  
  
  
    pane.show();

// ..........................................................
// TEST VIEWS
// 

module('SC.SelectFieldView ui', pane.standardSetup());

// test("basic", function() {
//   var view = pane.view('basic');
//   ok(!view.$().hasClass('disabled'), 'should not have disabled class');
//   ok(!view.$().hasClass('sel'), 'should not have sel class');
// });
// 
// test("disabled", function() {
//   var view = pane.view('disabled');
//   ok(view.$().hasClass('disabled'), 'should have disabled class');
// });
// 
// test("Not Selected", function() {
//   var view = pane.view('Not Selected');
//   ok(!view.$().hasClass('disabled'), 'should not have disabled class');
//   ok(!view.$().hasClass('sel'), 'should not have sel class');
// });
// 
// test("Not Visible", function() {
//   var view = pane.view('Not Visible');
//   ok(!view.$().hasClass('disabled'), 'should not have disabled class');
//   ok(!view.$().hasClass('sel'), 'should not have sel class');
// });
// 
// test("sortedStringOptions", function() {
//    var view = pane.view('sortedStringOptions');
//    equals(null,view.get('sortKey'), 'sortkey not specified');
// });
// 
// test("Width 150 Right 0", function() {  
//   var view = pane.view('Width 150 Right 0');
//   ok(!view.$().hasClass('disabled'), 'should not have disabled class');
//   ok(!view.$().hasClass('sel'), 'should not have sel class');
// });
// 
// test("Check that by setting the value the selection actually changes", function() {  
//   var view = pane.view('Width 150 Right 0');
//   SC.RunLoop.begin();
//   view.set('value',2);
//   SC.RunLoop.end();
//   equals(view.getFieldValue(), 2, 'the field value should change to 2');
// });
// 
// test("redraw", function(){
//   var view = pane.view('redraw');
//   ok(view.get('objects').length === 0, "objects should be empty");
//   SC.RunLoop.begin();
//   view.set('objects', [1,6,11,2,8]);
//   SC.RunLoop.end();
//   ok(view.$('option').length === 5, "options length should be 5");
// });

test("Test using Objects in objects array", function() {  
  var view = pane.view('Object objects');
  SC.RunLoop.begin();
  equals(view.getFieldValue(), objectObjects[2], 'the field value should be the third object');
  ok(view.$()[0].options[2].selected, 'the matching option should be selected');
  view.set('value',objectObjects[3]);
  equals(view.getFieldValue(), objectObjects[3], 'the field value should change to the fourth object');
  ok(view.$()[0].options[3].selected, 'the matching option should be selected');
  view.set('value',objectObjects[1]);
  equals(view.getFieldValue(), objectObjects[1], 'the field value should change to the second object');
  ok(view.$()[0].options[1].selected, 'the matching option should be selected');
  SC.RunLoop.end();
});