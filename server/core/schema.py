import graphene
from graphene_django import DjangoObjectType
from .models import DeviceHandler,TestcaseHandler,DUTHandler,DeviceMapper

class TestcaseType(DjangoObjectType):
    class Meta:
        model = TestcaseHandler
        fields = '__all__'

class DeviceType(DjangoObjectType):
    class Meta:
        model = DeviceHandler
        fields = '__all__'

class DUTType(DjangoObjectType):
    class Meta:
        model = DUTHandler
        fileds = '__all__'

class DUTProfileType(DjangoObjectType):
    class Meta:
        model = DeviceMapper
        fields = '__all__'

class Query(graphene.ObjectType):
    all_testcase = graphene.List(TestcaseType)
    all_client_device = graphene.List(DeviceType)
    client_device = graphene.Field(DeviceType, id=graphene.Int(required=True))
    all_dut_devices = graphene.List(DUTType)
    dut_device = graphene.Field(DUTType, id=graphene.Int(required=True))
    dut_profile_list = graphene.List(DUTProfileType)

    def resolve_all_testcase(root, info):
        return TestcaseHandler.objects.all()
    
    def resolve_all_client_device(root, info):
        return DeviceHandler.objects.all()
    
    def resolve_client_device(root, info, id):
        return DeviceHandler.objects.get(pk=id)
    
    def resolve_all_dut_devices(root, info):
        return DUTHandler.objects.all()
    
    def resolve_dut_device(root, info, id):
        return DUTHandler.objects.get(pk=id)

    def resolve_dut_profile_list(root, info):
        return DeviceMapper.objects.all()
    
schema = graphene.Schema(query=Query)