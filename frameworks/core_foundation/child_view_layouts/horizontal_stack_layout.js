// ==========================================================================
// Project:   SproutCore
// Copyright: @2013 7x7 Software, Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
sc_require('views/view');


SC.mixin(SC.View,
  /** @scope SC.View */ {

  /**
    This child layout plugin automatically positions the view's child views in a
    horizontal stack and optionally adjusts the view's width to fit. It does this
    by checking the width of each child view and positioning the following child
    views accordingly. Afterwards, by default, any time that a child view's
    width or visibility changes, the view will use this plugin to re-adjust all
    following child views' positions and potentially its own width appropriately.

    This allows you to stack absolutely positioned views that dynamically change
    their width and/or visibility without having to resort to using browser
    flow layout.

    For example,

        MyApp.MyView = SC.View.extend({

          // Child views will be stacked in order horizontally.
          childViewLayout: SC.View.HORIZONTAL_STACK,

          // The order of child views is important!
          childViews: ['sectionA', 'sectionB', 'sectionC'],

          // The view will resize itself to fit its children.
          // i.e. We don't need to specify layout.width, this is automatic.
          // The actual layout will become { left: 10, bottom: 20, top: 20, width: 270 } initially.
          layout: { left: 10, bottom: 20, top: 20 },

          sectionA: SC.View.design({

            // We don't need to specify layout.left, this is automatic.
            // The actual layout will become { left: 0, bottom: 0, top: 0, width: 100 } initially.
            layout: { width: 100 }

          }),

          sectionB: SC.View.design({

            // We don't need to specify layout.left, this is automatic.
            // The actual layout will become { border: 1, left: 100, bottom: 0, top: 0, width: 50 } initially.
            layout: { border: 1, width: 50 }

          }),

          sectionC: SC.View.design({

            // We don't need to specify layout.left, this is automatic.
            // The actual layout will become { left: 150, bottom: 10, top: 10, width: 120 } initially.
            layout: { right: 10, top: 10, width: 120 }

          })

        });

    ## Modify the default behavior with `childViewLayoutOptions`

    To modify the plugin behavior for all child view layouts, you can set the
    following child view layout options in `childViewLayoutOptions` on the view:

      - paddingBefore - Adds padding before the first child view.  Default: 0
      - paddingAfter - Adds padding after the last child view.  Default: 0
      - spacing - Adds spacing between each child view.  Default: 0
      - resizeToFit - Whether to resize the view to fit the child views (requires that each child view has a layout width).  Default: true

    For example,

        MyApp.MyView = SC.View.extend({

          // Child views will be stacked in order horizontally.
          childViewLayout: SC.View.HORIZONTAL_STACK,

          // Change the behavior of the HORIZONTAL_STACK plugin
          childViewLayoutOptions: {
            paddingBefore: 10,
            paddingAfter: 20,
            spacing: 5
          },

          // The order of child views is important!
          childViews: ['sectionA', 'sectionB', 'sectionC'],

          // The view will resize itself to fit its children. The actual layout will become { left: 10, bottom: 20, top: 20, width: 310 }
          layout: { left: 10, bottom: 20, top: 20 }, // Don't need to specify layout.width, this is automatic.

          sectionA: SC.View.design({

            // Actual layout will become { left: 10, bottom: 0, top: 0, width: 100 }
            layout: { width: 100 } // Don't need to specify layout.left, this is automatic.

          }),

          sectionB: SC.View.design({

            // Actual layout will become { border: 1, left: 115, bottom: 0, top: 0, width: 50 }
            layout: { border: 1, width: 50 } // Don't need to specify layout.left, this is automatic.

          }),

          sectionC: SC.View.design({

            // Actual layout will become { left: 170, top: 10, bottom: 10, width: 120 }
            layout: { top: 10, bottom: 10, width: 120 } // Don't need to specify layout.left, this is automatic.

          })

        });

    If `resizeToFit` is set to `false`, the view will not adjust itself to fit
    its child views.  This means that when `resizeToFit` is false, the view should
    specify its width component in its layout. A direct effect of this is the
    possibility for the child views to automatically expand or shrink in order to
    fill the empty, unclaimed space of the view.

    This available space is shared between all children that don't specify a fixed width
    such that their final width is calculated proportionally to the value of the
    property `fillRatio`.

    For simplicity, when none of the children specifies `fillRatio`,
    you can ignore the last child view's layout width and the last child view
    will stretch to fill the parent view.

    For example,

        MyApp.MyView = SC.View.extend({

          // Child views will be stacked in order horizontally.
          childViewLayout: SC.View.HORIZONTAL_STACK,

          // Change the behavior of the HORIZONTAL_STACK plugin
          childViewLayoutOptions: {
            paddingBefore: 10,
            paddingAfter: 20,
            spacing: 5,
            resizeToFit: false // Setting this to false, so that the child views stretch/contract to fit the parent's size.
          },

          // The order of child views is important!
          childViews: ['sectionA', 'sectionB', 'sectionC'],

          // The parent view will not resize itself to fit its contents, so we specify the width.
          layout: { left: 10, bottom: 20, top: 20, width: 500 },

          sectionA: SC.View.design({

            // We don't need to specify layout.left, this is automatic. This child will not stretch, its width is set.
            // Actual layout will become { left: 10, bottom: 0, top: 0, width: 100 }
            layout: { width: 100 }

          }),

          sectionB: SC.View.design({

            // The unclaimed space so far is 500 - 10 - 100 - 5 - 5 - 20, or 360px. This space will be shared between
            // the two last sections, because we won't specity a width on them.
            // This view will get 1/3 of the available space, because the other flexibile view has a ratio of 2.
            fillRatio: 1,

            // This section will take 1/3 * 360px = 120px.
            // Actual layout will become { border: 1, left: 115, bottom: 0, top: 0, right: 265 }, in other words, width == 120
            // We don't need to specify layout.left, layout.right or layout.width, this is automatic.
            layout: { border: 1 }

          }),

          sectionC: SC.View.design({

            // This view will get 2/3 of the available space, because the other flexibile view has a ratio of 1.
            fillRatio: 2,

            // This section will take 2/3 * 360px = 240px.
            // Actual layout will become { left: 240, top: 10, bottom: 10, right: 20 }, in other words, width == 240
            // We don't need to specify layout.left, layout.right or layout.width, this is automatic.
            layout: { top: 10, bottom: 10 }

          })

        });

    ## Modify specific child view layouts

    To adjust the child layout on a granular level per child view, you can
    also set the following properties on each child view:

      - marginBefore - Specify the minimum spacing above the child view.
      - marginAfter - Specify the minimum spacing below the child view.
      - useAbsoluteLayout - Don't include this child view in automatic layout, use absolute positioning based on the child view's `layout` property.
      - useStaticLayout - Don't include this child view in automatic layout.  This child view uses relative positioning and is not eligible for automatic layout.
      - isVisible - Non-visible child views are not included in the stack.
      - fillRatio - When the parent view is configured with a fixed dimension, children not specifying a width but specifying fillRatio will be resized to fill the unclaimed space proportionally to this ratio.

      For example,

        MyApp.MyView = SC.View.extend({

          // Child views will be stacked in order horizontally.
          childViewLayout: SC.View.HORIZONTAL_STACK,

          // Actual layout will become { left: 10, right: 10, top: 20, width: 570 }
          layout: { left: 10, right: 10, top: 20 },

          // Keep the child views ordered!
          childViews: ['sectionA', 'float', 'sectionB', 'sectionC'],

          sectionA: SC.View.design({
            // Actual layout will become { left: 0, right: 50, top: 0, width: 100 }
            layout: { right: 50, width: 100 },
            // The following child view will be at least 50px further right.
            marginAfter: 50
          }),

          float: SC.View.design({
            // This view will not be included in automatic layout and will not effect the stack.
            layout: { top: 5, right: 5, height: 50, width: 50 },
            useAbsoluteLayout: true
          }),

          sectionB: SC.View.design({
            // Actual layout will become { left: 1500, right: 0, top: 0, width: 120 }
            layout: { width: 120 }
          }),

          sectionC: SC.View.design({
            // Actual layout will become { left: 470, bottom: 0, top: 0, width: 100 }
            layout: { width: 100 },
            // This child view will be at least 200px to the right of the previous.
            marginBefore: 200
          })

        });

    ### A Note About Spacing

    Note that the spacing attribute in `childViewLayoutOptions` becomes the
    _minimum margin between child views, without explicitly overriding it from
    both sides using `marginAfter` and `marginBefore`_.  For example, if `spacing`
    is 25, setting `marginAfter` to 10 on a child view will not result in the
    next child view being 10px to the right of it, unless the next child view also
    specified `marginBefore` as 10.

    What this means is that it takes less configuration if you set `spacing` to
    be the _smallest margin you wish to exist between child views_ and then use
    the overrides to grow the margin if necessary.  For example, if `spacing`
    is 5, setting `marginAfter` to 10 on a child view will result in the next
    child view being 10px to the right of it, without having to also specify
    `marginBefore` on that next child view.

    @extends SC.ChildViewLayoutProtocol
    @since Version 1.10
  */
  HORIZONTAL_STACK: {

    /** @private Properties to observe on child views that affect the overall child view layout. */
    childLayoutProperties: ['marginBefore', 'marginAfter', 'isVisible'],

    /** @private When resizeToFit is false, then we need to know when the view's frame changes. */
    layoutDependsOnSize: function (view) {
      var options = view.get('childViewLayoutOptions');

      if (options) {
        return SC.none(options.resizeToFit) ? false : !options.resizeToFit;
      } else {
        return false;
      }
    },

    /** @private */
    layoutChildViews: function (view) {
      var childViews = view.get('childViews'),
        options = view.get('childViewLayoutOptions') || {},
        resizeToFit = SC.none(options.resizeToFit) ? true : options.resizeToFit,
        lastMargin = 0, // Used to avoid adding spacing to the final margin.
        marginAfter = options.paddingBefore || 0,
        paddingAfter = options.paddingAfter || 0,
        leftPosition = 0,
        provisionedSpace = 0,
        autoFillAvailableSpace = 0,
        totalAvailableSpace = 0,
        totalFillAvailableSpaceRatio = 0,
        spacing = options.spacing || 0,
        childView,
        fillRatio,
        layout,
        marginBefore,
        i, len;

      // if the view is not configured to resize to fit content, then we give a chance to the children to fill the available space
      // we make a 1st pass to check the conditions, to evaluate the available space and the proportions between children
      if (!resizeToFit) {

        totalAvailableSpace = view.get('frame').width;

        // if the view is not configured to resize and it doesn't have yet a width, it doesn't make sense to layout children
        if (!totalAvailableSpace) {
          return;
        }

        for (i = 0, len = childViews.get('length'); i < len; i++) {
          childView = childViews.objectAt(i);

          // Ignore child views with useAbsoluteLayout true, useStaticLayout true or that are not visible.
          if (!childView.get('isVisible') ||
            childView.get('useAbsoluteLayout') ||
            childView.get('useStaticLayout')) {
            continue;
          }

          layout = childView.get('layout');

          // Determine the left margin.
          marginBefore = childView.get('marginBefore') || 0;
          provisionedSpace += Math.max(marginAfter, marginBefore);

          // if the width is not set, let's check if is possible to resize the view
          if (SC.none(layout.width)) {
            fillRatio = childView.get('fillRatio');

            if (!SC.none(fillRatio)) {
              totalFillAvailableSpaceRatio += fillRatio;
            } else {
              // if none of the child views has fillRatio defined, allow the last one to stretch and fill the available space.
              if (i == len - 1 && totalFillAvailableSpaceRatio === 0) {
                totalFillAvailableSpaceRatio = 1;
              }
              //@if(debug)
              // Add some developer support.
              else {
                // even if we don't have a width set, as last instance we accept the presence of minWidth
                if (SC.none(layout.minWidth))
                {
                  SC.warn('Developer Warning: The SC.View.HORIZONTAL_STACK plugin requires that each childView layout contains at least a width or has a configured fillRatio. The layout may also optionally contain top and bottom, top and height, bottom and height or centerY and height.  The childView %@ has an invalid layout/fillRatio: %@'.fmt(childView, SC.stringFromLayout(layout)));
                  return;
                }
              }
              //@endif
            }
          } else {
            provisionedSpace += childView.getPath('borderFrame.width');
          }

          // Determine the right margin.
          lastMargin = childView.get('marginAfter') || 0;
          marginAfter = lastMargin || spacing;
        }

        // consider the end padding when calculating the provisionedSpace
        if (provisionedSpace !== 0 || totalFillAvailableSpaceRatio !== 0) {
          provisionedSpace += Math.max(lastMargin, paddingAfter);
        }

        autoFillAvailableSpace = Math.max(0, totalAvailableSpace - provisionedSpace);
      }

      // reset the references for the effective layout
      lastMargin = 0;
      marginAfter = options.paddingBefore || 0;
      paddingAfter = options.paddingAfter || 0;

      for (i = 0, len = childViews.get('length'); i < len; i++) {
        var width,
          adjustLeft,
          adjustRight;

        childView = childViews.objectAt(i);

        // Ignore child views with useAbsoluteLayout true, useStaticLayout true or that are not visible.
        if (!childView.get('isVisible') ||
          childView.get('useAbsoluteLayout') ||
          childView.get('useStaticLayout')) {
          continue;
        }

        layout = childView.get('layout');

        //@if(debug)
        // Add some developer support. The case of !resizeToFit was already checked above
        if (resizeToFit && SC.none(layout.width) && SC.none(layout.minWidth)) {
          SC.warn('Developer Warning: The SC.View.HORIZONTAL_STACK plugin, when configured with resizeToFit, requires that each childView layout contains at least a width/minWidth and optionally also top and bottom, top and height, bottom and height or centerY and height.  The childView %@ has an invalid layout: %@'.fmt(childView, SC.stringFromLayout(layout)));
          return;
        }
        //@endif

        // Determine the left margin.
        marginBefore = childView.get('marginBefore') || 0;
        leftPosition += Math.max(marginAfter, marginBefore);

        // Try to avoid useless adjustments left or right or left then right.
        // The required adjustments will be merged into a single call
        adjustLeft = layout.left !== leftPosition;

        childView.beginPropertyChanges();
        if (!resizeToFit && !layout.width) {
          var rightPosition;

          fillRatio = childView.get('fillRatio');

          // if the last child doesn't define fillRatio, default it to 1 as above during the 1st pass
          if (i == len - 1 && SC.none(fillRatio)) {
            fillRatio = 1;
          }

          // we should get here only in two cases: 1. child defines fillRatio, 2. child defines a minWidth
          // if both defined, we prefer to handle fillRatio, the other case being handled below by the normal adjustment to left
          if (!SC.none(fillRatio)) {
            var currentAvailableSpaceRatio = (fillRatio / totalFillAvailableSpaceRatio);

            // calculate the width according to fillRatio and totalFillAvailableSpaceRatio
            // but set the "right" position so any subsequent layout is not considering the width as fixed
            width = Math.ceil(autoFillAvailableSpace * currentAvailableSpaceRatio);

            // INCOMPLETE: We need to flag this view as constrained and re-compute all the auto-fill amounts
            // Constrain the width to the maximum width allowed.
            // var maxWidth = layout.maxWidth;
            // if (!SC.none(maxWidth)) {
            //   // Constrain the width according to maxWidth. Which frees up additional available space for further child views.
            //   if (width > maxWidth) {
            //     width = maxWidth;
            //   }
            // }

            // Determine the right position. If the position overflows (i.e. goes negative) because of rounding up, stop at 0.
            rightPosition = Math.max(0, totalAvailableSpace - leftPosition - width);
            adjustRight = layout.right !== rightPosition;

            if (adjustRight) {
              childView.adjust('right', rightPosition);
            }
          }
        }

        if (adjustLeft) {
          childView.adjust('left', leftPosition);
        }
        childView.endPropertyChanges();

        leftPosition += childView.getPath('borderFrame.width');

        // Determine the right margin.
        lastMargin = childView.get('marginAfter') || 0;
        marginAfter = lastMargin || spacing;
      }

      // If the current size is 0 (all children are hidden), it doesn't make sense to add the padding
      if (leftPosition !== 0) {
        leftPosition += Math.max(lastMargin, paddingAfter);
      }

      // Adjust our frame to fit as well, this ensures that scrolling works.
      if (resizeToFit && view.getPath('layout.width') !== leftPosition) {
        view.adjust('width', leftPosition);
      }
    }

  }

});
