package com.reownshop.account;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.reownshop.user.User;

@Service
public class AccountService {
    private static final Map<String, Boolean> DEFAULT_PREFS = Map.of("ORDER", true, "OFFER", true, "MESSAGE", true, "SYSTEM", true);
    private final AddressRepository addressRepository;
    private final UserSettingsRepository settingsRepository;
    public AccountService(AddressRepository addressRepository, UserSettingsRepository settingsRepository) { this.addressRepository = addressRepository; this.settingsRepository = settingsRepository; }

    @Transactional(readOnly = true)
    public AccountDtos.AddressList addresses(User user) { return new AccountDtos.AddressList(addressRepository.findByUserIdOrderByDefaultAddressDescIdDesc(user.getId()).stream().map(AccountDtos.AddressResponse::from).toList()); }

    @Transactional
    public AccountDtos.AddressResponse addAddress(User user, AccountDtos.AddressRequest request) {
        if (request == null || request.recipient() == null || request.phone() == null || request.province() == null || request.district() == null || request.ward() == null || request.detail() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thông tin địa chỉ");
        }
        boolean makeDefault = Boolean.TRUE.equals(request.defaultAddress()) || addressRepository.findByUserIdOrderByDefaultAddressDescIdDesc(user.getId()).isEmpty();
        if (makeDefault) addressRepository.clearDefault(user.getId());
        return AccountDtos.AddressResponse.from(addressRepository.save(new Address(user, request.recipient(), request.phone(), request.province(), request.district(), request.ward(), request.detail(), makeDefault)));
    }

    @Transactional
    public void deleteAddress(User user, Long id) { addressRepository.findByIdAndUserId(id, user.getId()).ifPresentOrElse(addressRepository::delete, () -> { throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy địa chỉ"); }); }

    @Transactional(readOnly = true)
    public AccountDtos.SettingsResponse settings(User user) {
        UserSettings settings = settingsRepository.findById(user.getId()).orElse(null);
        return settings == null ? new AccountDtos.SettingsResponse(DEFAULT_PREFS, "SYSTEM") : new AccountDtos.SettingsResponse(settings.getNotifyPrefs(), settings.getTheme());
    }

    @Transactional
    public AccountDtos.SettingsResponse updateSettings(User user, AccountDtos.SettingsRequest request) {
        String theme = request == null || request.theme() == null ? "SYSTEM" : request.theme().toUpperCase();
        if (!List.of("LIGHT", "DARK", "SYSTEM").contains(theme)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Theme không hợp lệ");
        Map<String, Boolean> prefs = request == null || request.notifyPrefs() == null ? DEFAULT_PREFS : request.notifyPrefs();
        UserSettings settings = settingsRepository.findById(user.getId()).orElseGet(() -> new UserSettings(user, prefs, theme));
        settings.update(prefs, theme);
        settingsRepository.save(settings);
        return new AccountDtos.SettingsResponse(prefs, theme);
    }
}
