// Copyright 2018-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

// Must be first: sets Kantumruy Pro before any PhetFont is constructed at import time.
import './applyKantumruyFontFamily.js';

import localeProperty from '../../joist/js/i18n/localeProperty.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import createLanguageSwitch from './createLanguageSwitch.js';
import FractionsMixedNumbersStrings from './FractionsMixedNumbersStrings.js';
import GameScreen from './view/GameScreen.js';
import IntroScreen from './view/IntroScreen.js';
import LabScreen from './view/LabScreen.js';

const fractionsMixedNumbersTitleStringProperty = FractionsMixedNumbersStrings[ 'fractions-mixed-numbers' ].titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Jonathan Olson, Sam Reid, Martin Veillette',
    team: 'Mike Dubson, Trish Loeblein, Ariel Paul, Kathy Perkins, Vincent Davis, Michael Moorer, Dusty Cole',
    qualityAssurance: 'Steele Dalton, Megan Lai, Liam Mulhall, Laura Rea, Jacob Romero, Kathryn Woessner, and Kelly Wurtz',
    graphicArts: '',
    thanks: ''
  }
};

const launchSimulation = () => {

  // Khmer is the default locale for this KruMath fork.
  localeProperty.value = 'km';

  const sim = new Sim( fractionsMixedNumbersTitleStringProperty, [
    new IntroScreen(),
    new GameScreen(),
    new LabScreen()
  ], {
    ...simOptions,
    // CAV-style Khmer | English switch on the home screen (bottom center).
    homeScreenWarningNode: createLanguageSwitch()
  } );
  sim.start();
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );
