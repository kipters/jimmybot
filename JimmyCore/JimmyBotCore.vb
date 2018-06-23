Imports JimmyCore.Services

Public Class JimmyBotCore
    Private ReadOnly _dataStore As IDataStore
    Private ReadOnly _telegram As ITelegramService
    
    Public Sub New (dataStore As IDataStore, telegram As ITelegramService, config As Config)
        _dataStore = dataStore
        _telegram = telegram
    End Sub
    
    Public Function HandleMessage(message As TelegramMessage) As TelegramMessage
        If message.Text.ToLower().Contains("javascript")
            Return message.Reply("javascript merda 💩")
        Else 
            Return Nothing
        End If
    End Function
    
End Class
