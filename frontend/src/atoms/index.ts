import { atom } from 'jotai';
import { atomWithDevtools } from 'jotai-devtools';

// Import all atoms
import * as alertAtoms from './alertAtoms';
import * as listAtoms from './listAtom';

// Configure alert atoms with debug labels
alertAtoms.alertType.debugLabel = 'Alert Type';
alertAtoms.alertTitle.debugLabel = 'Alert Title';
alertAtoms.alertMessage.debugLabel = 'Alert Message';
alertAtoms.alertShow.debugLabel = 'Alert Show';
alertAtoms.alertOnBtnClick.debugLabel = 'Alert Button Click Handler';
alertAtoms.alertErrorDetails.debugLabel = 'Alert Error Details';
alertAtoms.alertErrorMessage.debugLabel = 'Alert Error Message';

// Configure list atoms with debug labels
listAtoms.componentListAtom.debugLabel = 'Component List';
listAtoms.systemListAtom.debugLabel = 'System List';
listAtoms.deviceListAtom.debugLabel = 'Device List';
// scheduleListAtom already has a debug label

// Re-export all atoms
export * from './alertAtoms';
export * from './listAtom';

// Create a setup function to register atoms with the store
export function setupAtoms(store) {
  const atoms = [
    ...Object.values(alertAtoms),
    ...Object.values(listAtoms),
  ];
  
  // Register all atoms with the store
  atoms.forEach(atomValue => {
    if (typeof atomValue === 'object' && atomValue !== null && 'debugLabel' in atomValue) {
      // This is an atom with a debug label
      store.set(atomValue, atomValue.init);
    }
  });
  
  return atoms;
}

