from django import forms

class ReplyToMessageForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}))
