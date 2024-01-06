from django import forms
from .models import Recipe, Folder

class RecipeAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(RecipeAdminForm, self).__init__(*args, **kwargs)
        if 'instance' in kwargs:
            user = kwargs['instance'].user
            self.fields['folder'].queryset = Folder.objects.filter(user=user)

    class Meta:
        model = Recipe
        fields = '__all__'
