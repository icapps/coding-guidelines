# iCapps Swift Style Guide.
This style guide outlines the coding conventions of the iOS teams at iCapps. For the base of our swift guide, we've used the one of raywenderlich because we feel it's the most complete and updated it to our needs.

Writing Objective-C? Check out our [Objective-C Style Guide](https://github.com/icapps/coding-guidelines/tree/master/iOS/Objective-C) too.

## Table of Contents

* [Naming](#naming)
	* [Prose](#prose)
	* [Class Prefixes](#class-prefixes)
* [Spacing](#spacing)
* [Comments](#comments)
* [Classes and Structures](#classes-and-structures)
	* [Use of Self](#use-of-self)
	* [Protocol Conformance](#protocol-conformance)
	* [Computed Properties](#computed-properties)
* [Function Declarations](#function-declarations)
* [Closure Expressions](#closure-expressions)
* [Types](#types)
	* [Constants](#constants)
	* [Optionals](#optionals)
	* [Struct Initializers](#struct-initializers)
	* [Type Inference](#type-inference)
	* [Syntactic Sugar](#syntactic-sugar)
* [Control Flow](#control-flow)
	* [switch over if](#Prefer `switch` over `if`)
* [Semicolons](#semicolons)
* [MARK](#mark)
* [`Throw` versus `return nil`](#Throw` versus `return nil`)
* [Language](#language)
* [Credits](#credits)

## Naming
Use descriptive names with camel case for classes, methods, variables, etc. Class names should be capitalized, while method names and variables should start with a lower case letter.

**Preferred:**

```swift
private let maximumWidgetCount = 100

class WidgetContainer {
    var widgetButton: UIButton
    let widgetHeightPercentage = 0.85
}
```

**Not Preferred:**

```swift
let MAX_WIDGET_COUNT = 100

class app_widgetContainer {
    var wBut: UIButton
    let wHeightPct = 0.85
}
```

For functions and init methods, prefer *named parameters* for all arguments unless the context is very clear. Include external parameter names if it makes function calls more readable.

```swift
func date(from string: String) -> Date
func convertPoint(at column: Int, in row: Int) -> CGPoint
func timedAction(after delay: NSTimeInterval, perform action: SKAction) -> SKAction!

// would be called like this:
date(from: "2014-03-14")
convertPoint(at: 42, in: 13)
timedAction(after: 1.0, perform: someOtherAction)
// Improvement on this would be to also name the variables
let dateString = "2014-03-14"
let column = 42
let row = 13
let time = 1.0
date(from: dateString)
convertPoint(at: column, in: row)
timedAction(after: time, perform: someOtherAction)
```
In code you use a lot of `10.0` or `"string"`. This is handy to get things going.
But after a while this becomes dangerous. Also the naming conventions of `Swift 3.0` prefer
shorter but descriptive naming. If you use variable name over `primitive types` the code
becomes more descriptive. As examplified above.

For methods, follow the standard Apple convention of referring to the first parameter in the method name:

```swift
class Counter {
    func combine(with counter: Counter, options: Dictionary?) { ... }
    func increment(by amount: Int) { ... }
}
```

### Enumerations
Use LowerCamelCase for enumeration values:

```swift
enum Shape {
    case rectangle
    case square
    case triangle
    case circle
}
```

### Prose
When referring to functions in prose (tutorials, books, comments) include the required parameter names from the caller's perspective or `_` for unnamed parameters.

> Call `convertPoint(at:in:)` from your own `init` implementation.If you call `date(from:)` make sure that you provide a string with the format "yyyy-MM-dd".If you call `timedAction(after:perform:)` from `viewDidLoad()` remember to provide an adjusted delay value and an action to perform.You shouldn't call the data source method `tableView(_:cellForRowAtIndexPath:)` directly.
When in doubt, look at how Xcode lists the method in the jump bar – our style here matches that.

![Methods in Xcode jump bar](Screenshots/xcode-jump-bar.png)

### Class Prefixes
Swift types are automatically namespaced by the module that contains them and you should not add a class prefix. If two names from different modules collide you can disambiguate by prefixing the type name with the module name.

```swift
import SomeModule

let myClass = MyModule.UsefulClass()
```

## Spacing

* Indent using _tabs_, it really looks better. Be sure to set this preference in Xcode as shown below:

  ![Xcode indent settings](Screenshots/indentation.png)

* Method braces and other braces (`if`/`else`/`switch`/`while` etc.) always open on the same line as the statement but close on a new line.
* Tip: You can re-indent by selecting some code (or ⌘A to select all) and then Control-I (or Editor\Structure\Re-Indent in the menu).

**Preferred:**
```swift
if user.isHappy {
    // Do something
} else {
    // Do something else
}
```

**Not Preferred:**
```swift
if user.isHappy
{
  // Do something
}
else {
  // Do something else
}
```

* There should be exactly one blank line between methods to aid in visual clarity and organisation. Whitespace within methods should separate functionality, but having too many sections in a method often means you should refactor into several methods.

## Comments
When they are needed, use comments to explain **why** a particular piece of code does something. Comments must be kept up-to-date or deleted.

Avoid block comments inline with code, as the code should be as self-documenting as possible. When you put a comment inside a function this is an indication you could make it a function. Like so:

```swift
  func isFooFunny(foo: Foo) throws -> Bool? {
      if foo.gender == 0 { //This is a girl
        return foo.joke.hasSuffix("HaHa")
      } else if foo.gender == 1 { //This is a boy
        return foo.joke.hasPrefix("...Ha...Bla ... Ha")
      } else { //We do not support androgine cases yet
        throw Error.NoAndroginesYet
        return nil
      }
  }
```
Rewrite with meaningful functions and comments:

```swift
  /// The purpose of this function is to know of Foo can tell a funny joke in an objective way.
  /// - returns : `nil` is returned if the joke is from an androgine person. We have no algorithm for that yet!
  func isFunny(_ foo: Foo) throws -> Bool? {
    guard !foo.isAndrogine else {
      return nil
    }

    let girlSuffix = "HaHa"
    let boySuffix = "...Ha...Bla ... Ha"

    return foo.isBoy ? foo.joke.hasSuffix(boySuffix) : foo.joke.hasSuffix(girlSuffix)
  }
```

### Documentation comments
Comments used for documentation functions can be 'marked' with `/** */` or `///`. We never use `/** */` but  `///` on every line like the `isFooFunny(foo:)` example above.

## Classes and Structures

### Which one to use?
Remember, structs have [value semantics](https://developer.apple.com/library/mac/documentation/Swift/Conceptual/Swift_Programming_Language/ClassesAndStructures.html#//apple_ref/doc/uid/TP40014097-CH13-XID_144). Use structs for things that do not have an identity. An array that contains [a, b, c] is really the same as another array that contains [a, b, c] and they are completely interchangeable. It doesn't matter whether you use the first array or the second, because they represent the exact same thing. That's why arrays are structs.

Classes have [reference semantics](https://developer.apple.com/library/mac/documentation/Swift/Conceptual/Swift_Programming_Language/ClassesAndStructures.html#//apple_ref/doc/uid/TP40014097-CH13-XID_145). Use classes for things that do have an identity or a specific life cycle. You would model a person as a class because two person objects are two different things. Just because two people have the same name and birthdate, doesn't mean they are the same person. But the person's birthdate would be a struct because a date of 3 March 1950 is the same as any other date object for 3 March 1950. The date itself doesn't have an identity.

Sometimes, things should be structs but need to conform to `AnyObject` or are historically modeled as classes already (`Date`, `Set`). Try to follow these guidelines as closely as possible.

### Example definition
Here's an example of a well-styled class definition:

```swift
class Circle: Shape {
    var x: Int, y: Int
    var radius: Double
    var diameter: Double {
        get {
            return radius * 2
        }
        set {
            radius = newValue / 2
        }
    }

    init(x: Int, y: Int, radius: Double) {
        self.x = x
        self.y = y
        self.radius = radius
    }

    convenience init(x: Int, y: Int, diameter: Double) {
        self.init(x: x, y: y, radius: diameter / 2)
    }

    func describe() -> String {
        return "I am a circle at \(centerString()) with an area of \(computeArea())"
    }

    override func computeArea() -> Double {
        return M_PI * radius * radius
    }

    private func centerString() -> String {
        return "(\(x),\(y))"
    }
}
```

The example above demonstrates the following style guidelines:

* Specify types for properties, variables, constants, argument declarations and other statements with a space after the colon but not before, e.g. `x: Int`, and `Circle: Shape`.
* Define multiple variables and structures on a single line if they share a common purpose / context.
* Indent getter and setter definitions and property observers.
* Don't add modifiers such as `internal` when they're already the default. Similarly, don't repeat the access modifier when overriding a method.

### Use of Self
For conciseness, avoid using `self` since Swift does not require it to access an object's properties or invoke its methods.

Use `self` when required to differentiate between property names and arguments in initializers, and when referencing properties in closure expressions (as required by the compiler):

```swift
class BoardLocation {
    let row: Int, column: Int

    init(row: Int, column: Int) {
        self.row = row
        self.column = column

        let closure = {
            println(self.row)
        }
    }
}
```

### Protocol Conformance
When adding protocol conformance to a class, prefer adding a separate class extension for the protocol methods. This keeps the related methods grouped together with the protocol and can simplify instructions to add a protocol to a class with its associated methods.

Also, don't forget the `// MARK: -` comment to keep things well-organized!

**Preferred:**
```swift
class MyViewcontroller: UIViewController {
    // class stuff here
}

// MARK: - UITableViewDataSource
extension MyViewcontroller: UITableViewDataSource {
    // table view data source methods
}

// MARK: - UIScrollViewDelegate
extension MyViewcontroller: UIScrollViewDelegate {
    // scroll view delegate methods
}
```

**Not Preferred:**
```swift
class MyViewcontroller: UIViewController, UITableViewDataSource, UIScrollViewDelegate {
    // all methods
}
```

### Computed Properties
For conciseness, if a computed property is read-only, omit the get clause. The get clause is required only when a set clause is provided.

**Preferred:**
```swift
var diameter: Double {
    return radius * 2
}
```

**Not Preferred:**
```swift
var diameter: Double {
    get {
        return radius * 2
    }
}
```

## Function Declarations
Keep short function declarations on one line including the opening brace:

```swift
func reticulate(_ splines: [Double]) -> Bool {
    // reticulate code goes here
}
```

For functions with long signatures, add line breaks at appropriate points and add an extra indent on subsequent lines:

```swift
func reticulate(_ splines: [Double], adjustmentFactor: Double,
    translateConstant: Int, comment: String) -> Bool {
    // reticulate code goes here
}
```

## Closure Expressions
Use trailing closure syntax only if there's a single closure expression parameter at the end of the argument list. Give the closure parameters descriptive names.

**Preferred:**
```swift
UIView.animateWithDuration(1.0) {
    self.myView.alpha = 0
}

UIView.animateWithDuration(1.0,
    animations: {
        self.myView.alpha = 0
    },
    completion: { finished in
        self.myView.removeFromSuperview()
    }
)
```

**Not Preferred:**
```swift
UIView.animateWithDuration(1.0, animations: {
    self.myView.alpha = 0
})

UIView.animateWithDuration(1.0,
    animations: {
        self.myView.alpha = 0
    }) { f in
      self.myView.removeFromSuperview()
}
```

For single-expression closures where the context is clear, use implicit returns:

```swift
attendeeList.sort { a, b in
    a > b
}
```

## Types
Always use Swift's native types when available. Swift offers bridging to Objective-C so you can still use the full set of methods as needed.

**Preferred:**
```swift
let width = 120.0                                    // Double
let widthString = "\(width)"    // String
```

**Not Preferred:**
```swift
let width: Number = 120.0                          // Number
let widthString: String = width.stringValue        // String
```

In Sprite Kit code, use `CGFloat` if it makes the code more succinct by avoiding too many conversions.

### Constants
Constants are defined using the `let` keyword, and variables with the `var` keyword. Always use `let` instead of `var` if the value of the variable will not change.

**Tip:** A good technique is to define everything using `let` and only change it to `var` if the compiler complains!

### Optionals
Declare variables and function return types as optional with `?` where a nil value is acceptable.

Use implicitly unwrapped types declared with `!` only for instance variables that you know will be initialized later before use, such as subviews that will be set up in `viewDidLoad`.

When accessing an optional value, use optional chaining if the value is only accessed once or if there are many optionals in the chain:

```swift
self.textContainer?.textLabel?.setNeedsDisplay()
```

Use optional binding when it's more convenient to unwrap once and perform multiple operations:

```swift
if let textContainer = self.textContainer {
    // do many things with textContainer
}
```

When naming optional variables and properties, avoid naming them like `optionalString` or `maybeView` since their optional-ness is already in the type declaration.

For optional binding, shadow the original name when appropriate rather than using names like `unwrappedView` or `actualLabel`.

**Preferred:**
```swift
var subview: UIView?
var volume: Double?

// later on...
if let subview = subview, volume = volume {
    // do something with unwrapped subview and volume
}
```

**Not Preferred:**
```swift
var optionalSubview: UIView?
var volume: Double?

if let unwrappedSubview = optionalSubview {
    if let realVolume = volume {
        // do something with unwrappedSubview and realVolume
    }
}
```

### Struct Initializers
Use the native Swift struct initializers rather than the legacy CGGeometry constructors.

**Preferred:**
```swift
let bounds = CGRect(x: 40, y: 20, width: 120, height: 80)
let centerPoint = CGPoint(x: 96, y: 42)
```

**Not Preferred:**
```swift
let bounds = CGRectMake(40, 20, 120, 80)
let centerPoint = CGPointMake(96, 42)
```

Prefer the struct-scope constants `CGRect.infinite`, `CGRect.null`, etc. over global constants `CGRectInfinite`, `CGRectNull`, etc. For existing variables, you can use the shorter `.zero`.

### Type Inference
Prefer compact code and let the compiler infer the type for a constant or variable, unless you need a specific type other than the default such as `CGFloat` or `Int16`.

**Preferred:**
```swift
let message = "Click the button"
let currentBounds = computeViewBounds()
var names = [String]()
let maximumWidth: CGFloat = 106.5
```

**Not Preferred:**
```swift
let message: String = "Click the button"
let currentBounds: CGRect = computeViewBounds()
var names: [String] = []
```

**NOTE**: Following this guideline means picking descriptive names is even more important than before.

### Syntactic Sugar
Prefer the shortcut versions of type declarations over the full generics syntax.

**Preferred:**
```swift
var deviceModels: [String]
var employees: [Int: String]
var faxNumber: Int?
```

**Not Preferred:**
```swift
var deviceModels: Array<String>
var employees: Dictionary<Int, String>
var faxNumber: Optional<Int>
```

## Array or Set
In general Array’s are more used over Sets. However sets have some nice features:
* If the hasValue differs, the elements are unique
* [Set operations](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/CollectionTypes.html#//apple_ref/doc/uid/TP40014097-CH8-ID484) are very powerful , you can do `a - b = c` with sets.
* You can always go back to an Array if order is important

So as a rule prefer `Sets` when order is not important.

## Control Flow
Prefer the `for-in` style of `for` loop over the `for-condition-increment` style.

**Preferred:**
```swift
for _ in 0..<3 {
    println("Hello three times")
}

for (index, person) in attendeeList.enumerate() {
    println("\(person) is at position #\(index)")
}
```

**Not Preferred:**
```swift
for var i = 0; i < 3; i++ {
    println("Hello three times")
}

for var i = 0; i < attendeeList.count; i++ {
    let person = attendeeList[i]
    println("\(person) is at position #\(i)")
}
```
### Prefer `switch` over `if`
```swift
enum Case: Int {
	case one, two
}

// MARK: - NOT Preferred
let variable = Case.one
if variable == Case.one {
 // do something for one
} else if varialbe == two {
	// do something for two
} else {
	// something default
}

// MARK: - Pefered

switch variable {
case .one:
 // do something for one
case .two:
 // do something for two
default:
 // something default
}
```
#### Avoid Defaults in switch
Use the compiler to fix your mistakes. If possible avoid default cases in switches.

## Semicolons
Swift does not require a semicolon after each statement in your code. They are only required if you wish to combine multiple statements on a single line.

Do not write multiple statements on a single line separated with semicolons.

The only exception to this rule is the `for-conditional-increment` construct, which requires semicolons. However, alternative `for-in` constructs should be used where possible.

**Preferred:**
```swift
let swift = "not a scripting language"
```

**Not Preferred:**
```swift
let swift = "not a scripting language";
```

**NOTE**: Swift is very different to JavaScript, where omitting semicolons is [generally considered unsafe](http://stackoverflow.com/questions/444080/do-you-recommend-using-semicolons-after-every-statement-in-javascript)

## MARK

Swift has no header file. So to keep code in to small chunks use 2 things:
* Use `// MARK: - <Header>` to separate code
* Write code that goes together in extensions, (you can collapse them easily then)
* Add empty line above and below __MARK__

```swift

// MARK: - <Header>

extension Object { // ! no space between Mark and extension!

	func someFunction() {
		// Do stuff
	}

	func secondFunctionForHeader() {

	}

}

````

## Throw` versus `return nil`

Prefer throwing over returning nil. Why?
* `return` nil will cause the spread of using the optional `?` everywhere
* it is true you will spread around `try` but a `try` can throw an explicit error, when you return nil as an error you will have to debug why.

As en example look at looking up a model for a given `indexPath`.

```swift
enum ModelError: Error {
	case notFound
}
class ViewModel {
	func model(for indexPath: IndexPath) throws -> Country {
				 guard indexPath.row > 0 else {
						 throw ModelError.notFound
				 }

				 return models[offsetRow]
	}
}

```

Use in datasource delegate, can be used for `UICollectionView & UITableView`, method name below is abriviated.

```swift
func cellForRowAtIndexPath... {
	do {
		let cell = list.dequeue("modelCell", indexPath)
		let model = try viewModel.model(for: indexPath)
		cell.titleLabel.text= model.title
		return cell
	} catch {
		return list.dequeue("emptyCell", indexPath)
	}
}
```

## Language
Use US English spelling to match Apple's API.

**Preferred:**
```swift
let color = "red"
```

**Not Preferred:**
```swift
let colour = "red"
```

## Credits

* [raywenderlich.com Swift Style Guide](https://github.com/raywenderlich/swift-style-guide)
