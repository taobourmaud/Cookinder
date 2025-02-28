import { registerRootComponent } from 'expo';

import App from './App';
import seeders from './.seeders/seeders';

// seeders()
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

function main() {
    seeders()
    registerRootComponent(App)
}
// registerRootComponent(App);

main()