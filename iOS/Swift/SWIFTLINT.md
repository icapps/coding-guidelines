# Swiftlint


[Swiftlint](https://github.com/realm/SwiftLint) is a very nice and clean command line tool to check if your code is according to the guidelines. But Swiftlint doesn't do everything our way. That is why below we included an example configuration file.

## Setup

You can install Swiftlint with Homebrew by running  the following command:

    brew install swiftlint

## Configuration

Here is our configuration. Place the contents below in a `.swiftlint.yml` file in the root of your project.

```yml
excluded:
  - ./Pods

disabled_rules:
  - trailing_whitespace
```

Running `swiftlint` will check your code! 🙌
