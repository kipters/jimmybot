Namespace Services
    Public Interface IDataStore
        Property MinUnmuteTimeout() As TimeSpan
        Property MaxUnmuteTimeout() As TimeSpan

        Function TryMute(chatId As Integer) As Boolean
        Function TryUnmute(chatId As Integer) As Boolean
        Function GetExpiredMutes() As List(Of Integer)

        Function AddTrigger(trigger As String) As Boolean
        Function AddTriggers(triggers As IEnumerable(Of String)) As Boolean
        Function LoadTriggers() As List(Of String)
    End Interface
End NameSpace
