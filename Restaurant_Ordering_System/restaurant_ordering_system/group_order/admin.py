from django.contrib import admin
from .models import GroupOrder, GroupMember


@admin.register(GroupOrder)
class GroupOrderAdmin(admin.ModelAdmin):

    list_display = (
        "group_code",
        "created_by",
        "status",
        "created_at",
    )

    search_fields = (
        "group_code",
        "created_by__username",
    )

    list_filter = (
        "status",
        "created_at",
    )


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):

    list_display = (
        "group_order",
        "user",
        "joined_at",
    )

    search_fields = (
        "group_order__group_code",
        "user__username",
    )