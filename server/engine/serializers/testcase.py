from rest_framework import serializers
from ..models import TestcaseHandler, TestcaseRepo

class TestcaseRepoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestcaseRepo
        fields = '__all__'

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestcaseHandler
        fields = '__all__'
