/**
 * If the child is not visible the parent
 * scroll will be adjusted to make it visible.
 * @param parent Parent container
 * @param child Child container
 */
export const makeChildVisible = (parent: HTMLElement, child: HTMLElement): void => {

  // Parent's bounds
  const parentRect = parent.getBoundingClientRect();

  // Visible area
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth
  };

  // Child bounds
  const childRect = child.getBoundingClientRect();

  // Is the child visible
  const isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

  // If is not completely visible then adjust the parent scroll
  if (!isViewable) {
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top;
  }
};
