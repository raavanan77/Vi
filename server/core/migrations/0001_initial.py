# Generated by Django 5.1.4 on 2025-03-26 04:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BaseDevice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('username', models.CharField(max_length=200)),
                ('password', models.CharField(blank=True, max_length=200, null=True)),
                ('wanip', models.CharField(max_length=200)),
                ('waniface', models.CharField(blank=True, max_length=20, null=True)),
                ('laniface', models.CharField(blank=True, max_length=20, null=True)),
                ('sshport', models.IntegerField(blank=True, default=22, null=True)),
                ('platform', models.CharField(max_length=20)),
                ('extaprops', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ClientModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='TestcaseHandler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('testcasename', models.CharField(max_length=200, unique=True)),
                ('testplatform', models.CharField(max_length=30)),
                ('testarea', models.CharField(max_length=200)),
                ('isstandalone', models.BooleanField(default=False)),
                ('description', models.TextField(default='No Description')),
                ('priority', models.CharField(default='P0', max_length=20)),
                ('testcasedetails', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='TestcaseRepo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('testcasename', models.CharField(max_length=200, unique=True)),
                ('testplatform', models.CharField(max_length=30)),
                ('testtype', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TestSuiteHandler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('testsuitename', models.CharField(max_length=200, unique=True)),
                ('testsuiteplatform', models.CharField(max_length=30)),
                ('testcaselist', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='DeviceHandler',
            fields=[
                ('basedevice_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.basedevice')),
                ('rpcport', models.IntegerField(blank=True, default=7777, null=True)),
                ('rpcurl', models.URLField(blank=True, null=True)),
                ('wlaniface', models.CharField(blank=True, max_length=20, null=True)),
            ],
            bases=('core.basedevice',),
        ),
        migrations.CreateModel(
            name='DUTHandler',
            fields=[
                ('basedevice_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.basedevice')),
                ('serial', models.CharField(blank=True, max_length=50, null=True)),
                ('baudrate', models.IntegerField(blank=True, null=True)),
            ],
            bases=('core.basedevice',),
        ),
        migrations.CreateModel(
            name='DeviceMapper',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profilename', models.CharField(max_length=100, unique=True)),
                ('clientIdlist', models.ManyToManyField(related_name='client_model', to='core.clientmodel')),
                ('clientslist', models.ManyToManyField(related_name='mapped_clients', to='core.devicehandler')),
                ('dut_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.duthandler')),
            ],
        ),
    ]
