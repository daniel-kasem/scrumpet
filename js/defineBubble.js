function ThoughtBubble() {

    this.name = ("bubble_"+ ++bubbleCount),
    this.childArray = [],
    this.parentElementID = "",
    this.isChild = false,
    this.isParent = false,
    this.isPopped = false,
    this.newChildTimer = "",
    this.isOverlapped = false,
    this.Left = 0,
    this.Top = 0,
    this.height = 200,
    this.width = 200,
    this.popSound = new Audio("audio/addBubble.mp3");
}
