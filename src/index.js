import '@babel/polyfill'
import { main } from './app/app'

/*
wait for page to be loaded completely.
launch the main() if the document is loaded
*/
if (document.readyState === 'complete') main()
else document.addEventListener('DOMContentLoaded', main)
