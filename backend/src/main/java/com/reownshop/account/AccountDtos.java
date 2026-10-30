package com.reownshop.account;

import java.util.List;
import java.util.Map;

public final class AccountDtos {
    private AccountDtos() {}
    public record AddressRequest(String recipient, String phone, String province, String district, String ward, String detail, Boolean defaultAddress) {}
    public record AddressResponse(Long id, String recipient, String phone, String province, String district, String ward, String detail, boolean defaultAddress) {
        static AddressResponse from(Address a) { return new AddressResponse(a.getId(), a.getRecipient(), a.getPhone(), a.getProvince(), a.getDistrict(), a.getWard(), a.getDetail(), a.isDefaultAddress()); }
    }
    public record SettingsRequest(Map<String, Boolean> notifyPrefs, String theme) {}
    public record SettingsResponse(Map<String, Boolean> notifyPrefs, String theme) {}
    public record AddressList(List<AddressResponse> items) {}
}
