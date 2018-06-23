Public Interface ITelegramService
    Function SendTextMessage(chatId As Integer, text As String, markdown As Boolean) As Task
    Function ReplyToMessage(replyTo As Integer, chatId As Integer, markdown As Boolean) As Task
End Interface

Public Class TelegramMessage
    Public Sub New()
    End Sub
    
    Public Sub New(text As String, chatId As Integer, messageId As Integer)
        Me.Text = text
        Me.ChatId = chatId
        Me.MessageId = messageId
    End Sub
    
    Property Text() As String
    Property ChatId() As Integer
    Property ReplyTo() As Integer
    Property MessageId() As Integer
    Property Markdown() As Boolean
    
    Public Function Reply(replyText As String, Optional useMarkdown As Boolean = False) As TelegramMessage
        Dim msg = New TelegramMessage With { .Text = replyText, .ChatId = Me.ChatId, .ReplyTo = Me.MessageId, .Markdown = useMarkdown }
        Return msg
    End Function
End Class
