# Tailor

[Tailor](http://tailor.sh) is a cross-platform static analyzer and linter for Swift. In short Tailor helps you to conform to our coding guidelines.

## Installation

You can easily install Tailor with Homebrew.

    $ brew install tailor

When working on other OS's you can find more information [here](https://github.com/sleekbyte/tailor/wiki).

## Analyse your code

You can run Tailor from the command line like this:

    $ tailor

Or add it as a run script build phase to your Xcode project. This run script should contain the following line of code:

    /usr/local/bin/tailor

## Ignore code

Sometimes you don't want code to throw a warning because you are aware of what you are writing. When you want to do this, you'll have to add the following command behind the line of code in order for Tailor to ignore it.

    // tailor:disable

## Configuration

You can add configuration options by passing it to the command line utility.

    $ tailor --except=trailing-whitespace,terminating-newline

We prefer using the following exceptions because they can be a PITA during development:

- trailing-whitespace
- terminating-newline

More configuration options can be found on their [wiki page](https://github.com/sleekbyte/tailor/wiki#enabling-and-disabling-rules).
