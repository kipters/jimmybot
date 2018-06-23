Imports System.Threading
Imports JimmyCore
Imports Newtonsoft.Json
Imports Telegram.Bot
Imports Telegram.Bot.Types

Module Program
    Sub Main(args As String())
        Try
            AsyncMain(args).GetAwaiter().GetResult()
        Catch e As Exception
            Console.Error.WriteLine(e.ToString())
            Exit Try
        End Try
    End Sub

    Async Function AsyncMain(args As String()) As Task
        Dim rawConfig = Await IO.File.ReadAllTextAsync("config.json")
        Dim config = JsonConvert.DeserializeObject(Of Config)(rawConfig)
        
        Dim telegram = New TelegramBotClient(config.Token)
        Dim botInfo = Await telegram.GetMeAsync()
        
        Console.WriteLine($"{botInfo.Username} ready to go")
        
        Dim core = New JimmyBotCore(Nothing, Nothing, config)
        
        AddHandler telegram.OnMessage, Sub(sender, eventArgs)
            Dim message = eventArgs.Message
            Dim msg = New TelegramMessage(message.Text, message.Chat.Id, message.MessageId)
            
            Dim reply = core.HandleMessage(msg)
            
            If reply IsNot Nothing
                Dim parseMode = If(reply.Markdown, Enums.ParseMode.Markdown, Enums.ParseMode.Default)
                telegram.SendTextMessageAsync(reply.ChatId, reply.Text, parseMode, replyToMessageId := reply.ReplyTo)
            End If
        End Sub
        
        telegram.StartReceiving()
        
        Thread.Sleep(Timeout.Infinite)
    End Function
End Module
