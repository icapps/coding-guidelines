# Swiftlint

A very good project on github is [Swiftlint](https://github.com/realm/SwiftLint)

Install this in your projects to keep them clean. More info on Swiftlint github.

As an example you can use a `.swiftlint.yml` file to customize the rules you want and don't want.

```yml
excluded:
  - ./Pods

disabled_rules:
  - variable_name
  - type_name
  - void_return
  - closure_parameter_position

line_length:
  - 180

function_body_length:
  - 200
```
