/**
 * Merge babel *-strings_km.json into babel/_generated_development_strings/*_all.json
 * (required for unbuilt/dev-server locale switching).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const workspaceRoot = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '../..' );
const generatedDir = path.join( workspaceRoot, 'babel', '_generated_development_strings' );

const repos = [
  'fractions-mixed-numbers',
  'fractions-common',
  'vegas',
  'joist',
  'scenery-phet'
];

for ( const repo of repos ) {
  const kmPath = path.join( workspaceRoot, 'babel', repo, `${repo}-strings_km.json` );
  const allPath = path.join( generatedDir, `${repo}_all.json` );

  if ( !fs.existsSync( kmPath ) ) {
    throw new Error( `Missing ${kmPath}` );
  }
  if ( !fs.existsSync( allPath ) ) {
    throw new Error( `Missing ${allPath}` );
  }

  const km = JSON.parse( fs.readFileSync( kmPath, 'utf8' ) );
  const all = JSON.parse( fs.readFileSync( allPath, 'utf8' ) );

  // Merge: keep any pre-existing km keys, overwrite/add from our km file.
  all.km = { ...( all.km || {} ), ...km };

  fs.writeFileSync( allPath, `${JSON.stringify( all, null, 2 )}\n`, 'utf8' );
  console.log( `Patched km into ${path.basename( allPath )} (${Object.keys( km ).length} keys)` );
}

console.log( 'Done patching generated development strings.' );
